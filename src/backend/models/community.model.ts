/**
 * Community Domain Models
 * Types for blog, careers, and community features
 */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  cat: string;
  img: string;
}

export interface CareerJob {
  id: string; title: string; dept: string; location: string; type: string; posted: string;
}

export interface CareerStat {
  label: string; val: string;
}

export interface CareerData {
  stats: CareerStat[];
  jobs: CareerJob[];
}
