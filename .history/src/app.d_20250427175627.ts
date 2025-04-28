// src/app.d.ts

import type { User } from 'firebase/auth'; // (you can keep or remove this if unused)

declare namespace App {
  interface Locals {
    user: {
      firebaseUid: string;
    } | null;
  }
}

export {}; // ✅ Good, keeps module scope isolated