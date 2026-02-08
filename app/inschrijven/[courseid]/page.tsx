"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Euro,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseInfo {
  id: string;
  priceId: string; // ← Voeg deze regel toe
  title: string;
  date: string;
  dayOfWeek: string;
  location: string;
  address: string;
  availableSpots: number;
  price: number;
}

interface Participant {
  aanhef: string;
  voorletters: string;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  geboortedatum: string;
  telefoon: string;
  email: string;
}

export default function InschrijvenPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      aanhef: "",
      voorletters: "",
      voornaam: "",
      tussenvoegsel: "",
      achternaam: "",
      geboortedatum: "",
      telefoon: "",
      email: "",
    },
  ]);

  // Fetch course info
  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch");

        const courses = await response.json();
        const foundCourse = courses.find((c: CourseInfo) => c.id === courseId);

        if (!foundCourse) {
          router.push("/inschrijven");
          return;
        }

        setCourse(foundCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
        router.push("/#inschrijven");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, router]);

  // Update participants array when number changes
  useEffect(() => {
    if (numberOfParticipants > participants.length) {
      const newParticipants = [...participants];
      for (let i = participants.length; i < numberOfParticipants; i++) {
        newParticipants.push({
          aanhef: "",
          voorletters: "",
          voornaam: "",
          tussenvoegsel: "",
          achternaam: "",
          geboortedatum: "",
          telefoon: "",
          email: "",
        });
      }
      setParticipants(newParticipants);
    } else if (numberOfParticipants < participants.length) {
      setParticipants(participants.slice(0, numberOfParticipants));
    }
  }, [numberOfParticipants]);

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string,
  ) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
      setNumberOfParticipants(numberOfParticipants - 1);
    }
  };

  const addParticipant = () => {
    if (participants.length < (course?.availableSpots || 12)) {
      setNumberOfParticipants(numberOfParticipants + 1);
    }
  };

  const isFormValid = () => {
    return participants.every(
      (p) =>
        p.aanhef &&
        p.voorletters &&
        p.voornaam &&
        p.achternaam &&
        p.geboortedatum &&
        p.telefoon &&
        p.email,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid() || !course) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          priceId: course.priceId,
          quantity: participants.length,
          participants: participants,
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Er ging iets mis. Probeer het opnieuw.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const totalPrice = course.price * participants.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Course Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  Vul de cursistgegevens in zoals vermeld op het
                  identiteitsbewijs
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                €{course.price}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange" />
                <div>
                  <p className="font-medium">{course.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.dayOfWeek}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange" />
                <div>
                  <p className="font-medium">{course.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange" />
                <div>
                  <p className="font-medium">{course.availableSpots} plekken</p>
                  <p className="text-sm text-muted-foreground">
                    Nog beschikbaar
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Number of Participants */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Aantal deelnemers</CardTitle>
              <CardDescription>
                Hoeveel personen wil je inschrijven? (Max{" "}
                {course.availableSpots})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select
                  value={numberOfParticipants.toString()}
                  onValueChange={(value) =>
                    setNumberOfParticipants(parseInt(value))
                  }>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: Math.min(course.availableSpots, 12) },
                      (_, i) => i + 1,
                    ).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "deelnemer" : "deelnemers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Euro className="w-4 h-4" />
                  <span className="text-sm">
                    Totaal:{" "}
                    <span className="font-semibold text-foreground">
                      €{totalPrice}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants Forms */}
          <AnimatePresence>
            {participants.map((participant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Deelnemer {index + 1}
                      </CardTitle>
                      {participants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticipant(index)}
                          className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Verwijder
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aanhef */}
                    <div>
                      <Label htmlFor={`aanhef-${index}`}>
                        Aanhef <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={participant.aanhef}
                        onValueChange={(value) =>
                          updateParticipant(index, "aanhef", value)
                        }
                        required>
                        <SelectTrigger id={`aanhef-${index}`}>
                          <SelectValue placeholder="Selecteer..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="De heer">De heer</SelectItem>
                          <SelectItem value="Mevrouw">Mevrouw</SelectItem>
                          <SelectItem value="Anders">Anders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Voorletters */}
                    <div>
                      <Label htmlFor={`voorletters-${index}`}>
                        Voorletters <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`voorletters-${index}`}
                        value={participant.voorletters}
                        onChange={(e) =>
                          updateParticipant(
                            index,
                            "voorletters",
                            e.target.value,
                          )
                        }
                        placeholder="J."
                        required
                      />
                    </div>

                    {/* Voornaam */}
                    <div>
                      <Label htmlFor={`voornaam-${index}`}>
                        Voornaam <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`voornaam-${index}`}
                        value={participant.voornaam}
                        onChange={(e) =>
                          updateParticipant(index, "voornaam", e.target.value)
                        }
                        placeholder="Jan"
                        required
                      />
                    </div>

                    {/* Tussenvoegsel */}
                    <div>
                      <Label htmlFor={`tussenvoegsel-${index}`}>
                        Tussenvoegsel
                      </Label>
                      <Input
                        id={`tussenvoegsel-${index}`}
                        value={participant.tussenvoegsel}
                        onChange={(e) =>
                          updateParticipant(
                            index,
                            "tussenvoegsel",
                            e.target.value,
                          )
                        }
                        placeholder="de / van / van der"
                      />
                    </div>

                    {/* Achternaam */}
                    <div>
                      <Label htmlFor={`achternaam-${index}`}>
                        Achternaam <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`achternaam-${index}`}
                        value={participant.achternaam}
                        onChange={(e) =>
                          updateParticipant(index, "achternaam", e.target.value)
                        }
                        placeholder="Jansen"
                        required
                      />
                    </div>

                    {/* Geboortedatum */}
                    <div>
                      <Label htmlFor={`geboortedatum-${index}`}>
                        Geboortedatum{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`geboortedatum-${index}`}
                        type="date"
                        value={participant.geboortedatum}
                        onChange={(e) =>
                          updateParticipant(
                            index,
                            "geboortedatum",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>

                    {/* Telefoon */}
                    <div>
                      <Label htmlFor={`telefoon-${index}`}>
                        Telefoonnummer{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`telefoon-${index}`}
                        type="tel"
                        value={participant.telefoon}
                        onChange={(e) =>
                          updateParticipant(index, "telefoon", e.target.value)
                        }
                        placeholder="0612345678"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <Label htmlFor={`email-${index}`}>
                        E-mailadres <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={participant.email}
                        onChange={(e) =>
                          updateParticipant(index, "email", e.target.value)
                        }
                        placeholder="naam@bedrijf.nl"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Participant Button */}
          {participants.length < course.availableSpots && (
            <Button
              type="button"
              variant="outline"
              className="w-full mb-6"
              onClick={addParticipant}>
              <Plus className="w-4 h-4 mr-2" />
              Deelnemer toevoegen
            </Button>
          )}

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Totaalbedrag</p>
                  <p className="text-3xl font-bold">€{totalPrice}</p>
                  <p className="text-sm text-muted-foreground">
                    {participants.length}{" "}
                    {participants.length === 1 ? "deelnemer" : "deelnemers"} × €
                    {course.price}
                  </p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid() || isSubmitting}
                  className="bg-orange hover:bg-orange/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Bezig...
                    </>
                  ) : (
                    "Ga naar betalen"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Je wordt doorgestuurd naar een beveiligde betaalpagina van
                Stripe
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
