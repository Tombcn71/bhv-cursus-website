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

  // States
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState("");
  const [courses, setCourses] = useState<CourseWithBookings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingCourse, setDownloadingCourse] = useState<string | null>(
    null,
  );

  const CORRECT_KEY = process.env.NEXT_PUBLIC_WEBMASTER_KEY || "geheim123";

  // 1. Zorg dat we pas renderen als we in de browser zijn (voorkomt wit scherm)
  useEffect(() => {
    setIsLoaded(true);

    // Check direct of er een key in de URL staat
    const urlKey = searchParams.get("key");
    if (urlKey === CORRECT_KEY) {
      setIsAuthenticated(true);
      setKey(urlKey);
      // We kunnen loadCourses hier niet direct aanroepen zonder async,
      // dus we laten de useEffect hieronder het doen via de isAuthenticated state.
    }
  }, [searchParams, CORRECT_KEY]);

  // 2. Laad data zodra geauthenticeerd
  useEffect(() => {
    if (isAuthenticated) {
      loadCourses();
    }
  }, [isAuthenticated]);

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
      alert("Download mislukt.");
    } finally {
      setDownloadingCourse(null);
    }
  };

  // Cruciaal: toon NIETS (zelfs geen lader) totdat de browser de JS heeft geparsed.
  // Dit voorkomt de mismatch tussen server en client die het witte scherm veroorzaakt.
  if (!isLoaded) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>Webmaster Dashboard</CardTitle>
            <CardDescription>Toegangssleutel vereist</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Toegangssleutel"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="text-center"
              />
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Inloggen
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Webmaster Dashboard</h1>
          <p className="text-muted-foreground">Download deelnemerslijsten</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Geen boekingen gevonden
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground italic">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {course.date}
                        </span>
                        <span>{course.dayOfWeek}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {course.totalParticipants} deelnemers
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button
                    onClick={() => handleDownload(course.id, course.title)}
                    disabled={!!downloadingCourse}
                    className="bg-orange-600 hover:bg-orange-700 text-white">
                    {downloadingCourse === course.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Download Excel
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
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
