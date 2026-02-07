"use client";

import { useEffect, useState } from "react";
import { CourseCard, type CourseData } from "@/components/course-card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CoursesSection() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Add isPopular to first course
        const coursesWithPopular = data.map(
          (course: CourseData, index: number) => ({
            ...course,
            isPopular: index === 0,
          }),
        );

        setCourses(coursesWithPopular);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Kon cursussen niet laden. Probeer het later opnieuw.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Handler to navigate to enrollment page
  const handleEnroll = async (courseId: string, quantity: number) => {
    // Navigate to enrollment page with course ID
    router.push(`/inschrijven/${courseId}`);
  };

  return (
    <section id="cursussen" className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm bg-background text-muted-foreground">
            Cursusdata
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy tracking-tight text-balance">
            Kies jouw cursusdag
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecteer een datum en locatie die het beste bij je past. Alle
            cursussen zijn inclusief lunch en lesmateriaal.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
            <span className="ml-3 text-muted-foreground">
              Cursussen laden...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Course List */}
        {!isLoading && !error && courses.length > 0 && (
          <div className="space-y-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Momenteel zijn er geen cursussen beschikbaar.
            </p>
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted-foreground">
          Andere datum nodig?{" "}
          <a
            href="/contact"
            className="text-orange hover:underline font-medium">
            Neem contact op
          </a>{" "}
          voor maatwerk oplossingen.
        </motion.p>
      </div>
    </section>
  );
}
