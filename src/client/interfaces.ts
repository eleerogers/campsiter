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
  user_id: number;
  username: string;
}

export interface IComment {
  comment_id: number;
  comment: string;
  username: string;
  created_at: string;
  user_id: number;
  rating?: number;
}
