// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { User } from 'firebase/auth'; // or your own User type

declare namespace App {
  interface Locals {
    user: {
      firebaseUid: string;
    } | null;
  }
}
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
