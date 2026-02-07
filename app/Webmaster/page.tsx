"use client";

import { useEffect, useState } from "react";
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

export default function WebmasterPage() {
  const searchParams = useSearchParams();
  const urlKey = searchParams.get("key");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState("");
  const [courses, setCourses] = useState<CourseWithBookings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingCourse, setDownloadingCourse] = useState<string | null>(
    null,
  );

  const CORRECT_KEY = process.env.NEXT_PUBLIC_WEBMASTER_KEY || "geheim123"; // In production use env var

  useEffect(() => {
    if (urlKey === CORRECT_KEY) {
      setIsAuthenticated(true);
      setKey(urlKey);
      loadCourses();
    }
  }, [urlKey]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === CORRECT_KEY) {
      setIsAuthenticated(true);
      loadCourses();
    } else {
      alert("Onjuiste sleutel");
    }
  };

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

  const handleDownload = async (courseId: string, courseTitle: string) => {
    setDownloadingCourse(courseId);
    try {
      const response = await fetch(`/api/webmaster/export/${courseId}`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

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
      alert("Download mislukt. Probeer opnieuw.");
    } finally {
      setDownloadingCourse(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-orange" />
            </div>
            <CardTitle>Webmaster Dashboard</CardTitle>
            <CardDescription>
              Voer de toegangssleutel in om door te gaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Toegangssleutel"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="text-center"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange hover:bg-orange/90">
                Inloggen
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Webmaster Dashboard</h1>
          <p className="text-muted-foreground">
            Download deelnemerslijsten voor instructeurs
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Geen boekingen gevonden</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {course.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{course.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{course.dayOfWeek}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {course.totalBookings}{" "}
                        {course.totalBookings === 1 ? "boeking" : "boekingen"}
                      </Badge>
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {course.totalParticipants} deelnemers
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleDownload(course.id, course.title)}
                      disabled={
                        downloadingCourse === course.id ||
                        course.totalParticipants === 0
                      }
                      className="bg-orange hover:bg-orange/90">
                      {downloadingCourse === course.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloaden...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Excel
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 border-orange/20 bg-orange/5">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">
              <strong>Let op:</strong> De Excel bestanden bevatten
              persoonsgegevens. Behandel deze vertrouwelijk en deel ze alleen
              met de instructeur.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
