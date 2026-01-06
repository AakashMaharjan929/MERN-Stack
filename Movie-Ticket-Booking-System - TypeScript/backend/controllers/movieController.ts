import type { Request, Response } from "express";
import Movie from "../models/Movie.js";
import fs from "fs";
import path from "path";

const validateMovieInput = (data: any) => {
  const errors: string[] = [];

  if (!data.title || data.title.trim() === '') errors.push('Title is required');
  if (!data.description || data.description.trim() === '' || data.description.trim().length > 1000) errors.push('Description is required and must be under 1000 characters');
  if (!data.genre || data.genre.trim() === '') errors.push('Genre is required');
  if (!data.language || data.language.trim() === '') errors.push('Language is required');

  const durationNum = parseInt(data.duration, 10);
  if (isNaN(durationNum) || durationNum < 1) errors.push('Duration must be a positive number');

  if (!data.releaseDate) errors.push('Release date is required');
  else {
    const releaseDate = new Date(data.releaseDate);
    if (isNaN(releaseDate.getTime())) errors.push('Invalid release date format');
  }

  const directors = (data.director || '').split(',').map((d: string) => d.trim()).filter((d: string) => d !== '');
  if (directors.length === 0) errors.push('At least one director is required');
  const casts = (data.cast || '').split(',').map((c: string) => c.trim()).filter((c: string) => c !== '');
  if (casts.length === 0) errors.push('At least one cast member is required');

  const ratingNum = parseFloat(data.rating);
  if (data.rating !== undefined && (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)) errors.push('Rating must be between 0 and 10');

  if (errors.length > 0) throw new Error(errors.join(', '));

  return {
    ...data,
    duration: durationNum,
    releaseDate: new Date(data.releaseDate),
    director: directors,
    cast: casts,
    rating: ratingNum || 0,
    title: data.title.trim(),
    description: data.description.trim(),
    genre: data.genre.trim(),
    language: data.language.trim(),
  };
};

export const addMovie = async (req: Request, res: Response) => {
  try {
    const { title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating } = req.body;

    const profilePoster = (req as any).files?.profilePoster?.[0]?.filename;
    const bannerPoster = (req as any).files?.bannerPoster?.[0]?.filename;

    if (!profilePoster || !bannerPoster) {
      return res.status(400).json({ message: "Both posters are required" });
    }

    const validatedData = validateMovieInput({ title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating });

    const movie = await Movie.addMovie({
      ...validatedData,
      profilePoster,
      bannerPoster
    });

    res.status(201).json(movie);
  } catch (err: any) {
    console.error('Add movie error:', err.message);
    if (err.message.includes('required') || err.message.includes('invalid')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const { title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating } = req.body;

    const profilePoster = (req as any).files?.profilePoster?.[0]?.filename;
    const bannerPoster = (req as any).files?.bannerPoster?.[0]?.filename;

    if (profilePoster && (movie as any).profilePoster) {
      const oldPath = path.join(process.cwd(), "public", "posters", (movie as any).profilePoster);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    if (bannerPoster && (movie as any).bannerPoster) {
      const oldPath = path.join(process.cwd(), "public", "posters", (movie as any).bannerPoster);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title.trim() || (movie as any).title;
    if (description !== undefined) updateData.description = description.trim() || (movie as any).description;
    if (genre !== undefined) updateData.genre = genre.trim() || (movie as any).genre;
    if (language !== undefined) updateData.language = language.trim() || (movie as any).language;
    if (duration !== undefined) {
      const durNum = parseInt(duration, 10);
      updateData.duration = !isNaN(durNum) ? durNum : (movie as any).duration;
    }
    if (releaseDate !== undefined) {
      if (releaseDate) {
        const relDate = new Date(releaseDate);
        if (!isNaN(relDate.getTime())) updateData.releaseDate = relDate;
      } else {
        updateData.releaseDate = (movie as any).releaseDate;
      }
    }
    if (director !== undefined) {
      const dirs = director.split(',').map((d: string) => d.trim()).filter((d: string) => d !== '');
      updateData.director = dirs.length > 0 ? dirs : (movie as any).director;
    }
    if (cast !== undefined) {
      const csts = cast.split(',').map((c: string) => c.trim()).filter((c: string) => c !== '');
      updateData.cast = csts.length > 0 ? csts : (movie as any).cast;
    }
    if (certification !== undefined) updateData.certification = certification || (movie as any).certification;
    if (trailerUrl !== undefined) updateData.trailerUrl = trailerUrl || (movie as any).trailerUrl;
    if (status !== undefined) updateData.status = status || (movie as any).status;
    if (rating !== undefined) {
      const ratNum = parseFloat(rating);
      updateData.rating = !isNaN(ratNum) && ratNum >= 0 && ratNum <= 10 ? ratNum : (movie as any).rating;
    }
    if (profilePoster !== undefined) updateData.profilePoster = profilePoster;
    if (bannerPoster !== undefined) updateData.bannerPoster = bannerPoster;

    if (Object.keys(updateData).length === 0) {
      return res.json(movie);
    }

    await (movie as any).updateMovieDetails(updateData);

    res.json(movie);
  } catch (err: any) {
    console.error('Update movie error:', err.message);
    if (err.message.includes('required') || err.message.includes('invalid')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await (movie as any).deleteMovie();
    res.json({ message: "Movie deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const rateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userRating } = req.body as { userRating: number };
    if (userRating < 0 || userRating > 10)
      return res.status(400).json({ message: "Rating must be 0-10" });

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const newRating = await (movie as any).rateMovie(parseFloat(String(userRating)));
    res.json({ message: "Rating updated", rating: newRating });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMoviesByGenre = async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;
    const movies = await Movie.findByGenre(genre);
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMoviesByLanguage = async (req: Request, res: Response) => {
  try {
    const { language } = req.params;
    const movies = await Movie.findByLanguage(language);
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { query } = req.query as any;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    if (!query) return res.status(400).json({ message: "Query required" });

    const movies = await Movie.searchMovies(String(query), limit);
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTopRatedMovies = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 5;
    const movies = await Movie.findTopRated(limit);
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.language) query.language = req.query.language;
    if (req.query.status) query.status = req.query.status;

    const movies = await Movie.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Movie.countDocuments(query);
    res.json({ movies, total, page, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json((movie as any).getMovieInfo());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
