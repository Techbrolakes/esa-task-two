import React, { useState, useEffect } from "react";
import { getUser } from "@/utils/storage";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

type JokesByTime = {
  [key in TimeOfDay]: string[];
};

const getTimeOfDay = (hours: number): TimeOfDay => {
  if (hours >= 5 && hours < 12) return "morning";
  if (hours >= 12 && hours < 17) return "afternoon";
  if (hours >= 17 && hours < 21) return "evening";
  return "night";
};

const JOKES: JokesByTime = {
  morning: [
    "Why did the coffee file a police report? It got mugged!",
    "What did the breakfast say to the morning person? You're bacon me crazy!",
    "Why don't moons drink coffee? Because they're already wide awake!",
  ],
  afternoon: [
    "Why don't programmers like nature? It has too many bugs!",
    "What did the lunch say to the workaholic? Take a byte!",
    "Why did the cookie go to the doctor? Because it was feeling crumbly!",
  ],
  evening: [
    "What did the sunset say to the moon? You light up my night!",
    "Why don't vampires use Twitter? Too many stakes!",
    "What's a ghost's favorite dinner time? Boo o'clock!",
  ],
  night: [
    "Why did the math book look sad? Because it had too many problems!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't stars tell jokes? They'd nova stop!",
  ],
};

const GREETINGS: { [key in TimeOfDay]: string } = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Good night",
};

const UserGreeting = () => {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [joke, setJoke] = useState("");

  const getTimeBasedJoke = (timeOfDay: TimeOfDay): string => {
    const jokes = JOKES[timeOfDay];
    return jokes[Math.floor(Math.random() * jokes.length)];
  };

  useEffect(() => {
    const { data: user } = getUser();
    if (user?.fullname) {
      setUserName(user.fullname);
    }

    const now = new Date();
    const timeOfDay = getTimeOfDay(now.getHours());

    setGreeting(GREETINGS[timeOfDay]);
    setJoke(getTimeBasedJoke(timeOfDay));
  }, []);

  if (!userName) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-sm p-6 mb-6 border border-gray-800/50">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {greeting}, {userName}!
        </h2>
        <p className="text-gray-300 text-lg italic">&ldquo;{joke}&rdquo;</p>
      </div>
    </div>
  );
};

export default UserGreeting;
