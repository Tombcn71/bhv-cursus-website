"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Calendar, Users } from "lucide-react";

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
  const [courses, setCourses] = useState<CourseWithBookings[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Direct op true zetten
  const [downloadingCourse, setDownloadingCourse] = useState<string | null>(
    null,
  );

  // Zodra de pagina opent, halen we direct de data op. Geen password check meer!
  useEffect(() => {
    loadCourses();
  }, []);

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
      alert("Download mislukt. Probeer opnieuw.");
    } finally {
      setDownloadingCourse(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Webmaster Dashboard</h1>
          <p className="text-muted-foreground">
            Direct toegang tot deelnemerslijsten (beveiliging uitgeschakeld)
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
                        <div>{course.dayOfWeek}</div>
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
                <CardContent className="flex justify-end">
                  <Button
                    onClick={() => handleDownload(course.id, course.title)}
                    disabled={
                      downloadingCourse === course.id ||
                      course.totalParticipants === 0
                    }
                    className="bg-orange hover:bg-orange/90">
                    {downloadingCourse === course.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Downloaden...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" /> Download Excel
                      </>
                    )}
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
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
        </div>
      }>
      <DashboardContent />
    </Suspense>
  );
}
