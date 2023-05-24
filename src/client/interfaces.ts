export interface ICampground {
  created_at: string;
  description: string;
  id: number;
  image: string;
  image_id: string;
  lat: number;
  lng: number;
  location: string;
  name: string;
  price: string;
  rating?: string;
  user_id: string;
  username: string;
}

export interface IComment {
  comment_id: number;
  comment: string;
  username: string;
  created_at: string;
  user_id: number;
  rating: number;
}

interface IUserBase {
  id: string;
  password?: string;
  email: string;
  image: string;
  username: string;
}

export interface IUser extends IUserBase {
  created_at?: string;
  admin?: boolean,
  image_id: string;
  first_name: string;
  last_name: string;
}

export interface IUserCamelCase extends IUserBase {
  createdAt?: string;
  admin: boolean,
  imageId: string;
  firstName: string;
  lastName: string;
}

export interface ILoggedInAsContext {
  loggedInAs: IUserCamelCase;
  setLoggedInAs: (user: IUserCamelCase) => void;
  logoutUser: (path: string, push: (route: string) => void) => Promise<void>
}
