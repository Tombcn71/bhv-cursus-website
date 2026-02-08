"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Calendar, Users, Lock } from "lucide-react";

interface CourseWithBookings {
  id: string;
  title: string;
  date: string;
  dayOfWeek: string;
  totalBookings: number;
  totalParticipants: number;
  priceId: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  // Gebruik een fallback voor urlKey om crashes te voorkomen
  const urlKey = searchParams ? searchParams.get("key") : null;

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState("");
  const [courses, setCourses] = useState<CourseWithBookings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingCourse, setDownloadingCourse] = useState<string | null>(
    null,
  );

  // Pak de key uit env of gebruik de backup
  const CORRECT_KEY = process.env.NEXT_PUBLIC_WEBMASTER_KEY || "geheim123";

  // Stap 1: Zorg dat de component eerst veilig mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stap 2: Check de URL key
  useEffect(() => {
    if (mounted && urlKey === CORRECT_KEY) {
      setIsAuthenticated(true);
      setKey(urlKey || "");
      loadCourses();
    }
  }, [mounted, urlKey, CORRECT_KEY]);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/webmaster/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === CORRECT_KEY) {
      setIsAuthenticated(true);
      loadCourses();
    } else {
      alert("Onjuiste sleutel");
    }
  };

  const handleDownload = async (courseId: string, courseTitle: string) => {
    setDownloadingCourse(courseId);
    try {
      const response = await fetch(`/api/webmaster/export/${courseId}`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `deelnemers-${courseTitle.replace(/\s+/g, "-")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Download mislukt.");
    } finally {
      setDownloadingCourse(null);
    }
  };

  // Voorkom server-side rendering issues door niks te tonen tot mounted
  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto w-10 h-10 text-orange-500 mb-2" />
            <CardTitle>Webmaster Dashboard</CardTitle>
            <CardDescription>Voer de toegangssleutel in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Toegangssleutel"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <Button type="submit" className="w-full bg-orange-600">
                Inloggen
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cursus Overzicht</h1>
          <p className="text-gray-600">Download deelnemerslijsten</p>
        </div>

        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-600" />
        ) : (
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{course.date}</span>
                      <span>{course.totalParticipants} deelnemers</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(course.id, course.title)}
                    disabled={downloadingCourse === course.id}>
                    {downloadingCourse === course.id
                      ? "Laden..."
                      : "Download Excel"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WebmasterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Laden...
        </div>
      }>
      <DashboardContent />
    </Suspense>
  );
}
