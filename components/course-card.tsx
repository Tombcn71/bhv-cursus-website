"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Loader2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export interface CourseData {
  id: string;
  date: string;
  priceId: string;
  dayOfWeek: string;
  location: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  price: number;
  isPopular?: boolean;
}

interface CourseCardProps {
  course: CourseData;
  onEnroll?: (courseId: string, quantity: number) => Promise<void>;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const spotsPercentage =
    ((course.totalSpots - course.availableSpots) / course.totalSpots) * 100;
  const isAlmostFull = course.availableSpots <= 3;
  const isFull = course.availableSpots === 0;
  const maxQuantity = Math.min(course.availableSpots, 10); // Max 10 per bestelling

  const subtotal = course.price * quantity;
  const btwAmount = subtotal * 0.21; // Assuming BTW is 21%
  const total = subtotal + btwAmount;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + delta)));
  };

  const handleEnroll = async () => {
    if (onEnroll && !isFull) {
      await onEnroll(course.id, quantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}>
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-orange/30 ${isFull ? "opacity-60" : ""}`}>
        {course.isPopular && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-orange text-accent-foreground font-medium">
              Populair
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Date Section */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-orange rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                <span className="text-2xl font-bold leading-none">
                  {course.date.split(" ")[0]}
                </span>
                <span className="text-xs uppercase mt-0.5">
                  {course.date.split(" ")[1]}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4 text-orange" />
                  <span>{course.dayOfWeek}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange" />
                  <span className="font-semibold text-navy">
                    {course.location}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.address}
                </p>
              </div>
            </div>

            {/* Availability Section */}
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span
                    className={
                      isAlmostFull
                        ? "text-orange font-medium"
                        : "text-muted-foreground"
                    }>
                    {isFull ? "Vol" : `Nog ${course.availableSpots} plekken`}
                  </span>
                </div>
              </div>
              <Progress
                value={spotsPercentage}
                className="h-2 bg-foreground/20 [&>div]:bg-green-500"
              />
            </div>

            {/* Price & CTA */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <span className="text-2xl font-bold text-navy">
                  €{course.price}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  per persoon
                </span>
              </div>
              <Button asChild>
                <Link href={`/inschrijven/${course.id}`}>Schrijf nu in</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
