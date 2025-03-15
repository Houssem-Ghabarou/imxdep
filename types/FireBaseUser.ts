export interface User {
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  uid: string;
  email: string | null;
}
