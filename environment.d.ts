declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      GEOCODER_API_KEY: string;
      ADMIN_PASSWORD: string;
      GMAILPW: string;
      EXPRESS_SECRET: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      REACT_APP_GOOGLE_API_KEY: string;
      REACT_APP_ADMIN_EMAIL: string;
      SITE_EMAIL: string;
      REACT_APP_XXX: string;
    }
  }
}

export {}
