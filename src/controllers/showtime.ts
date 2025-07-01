import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Showtime from '../models/Showtime';
import Seat from '../models/Seat';
import Booking from '../models/Booking';
import { FilterQuery } from 'mongoose';

export const createShowtime: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const { movie, room, theater, startAt } = req.body;
  const now = new Date();

  const oneDayInMs = 24 * 60 * 60 * 1000;
  if (startAt.getTime() - now.getTime() < oneDayInMs) {
    res
      .status(400)
      .json({ msg: 'Suất chiếu phải được tạo trước 1 ngày so với ngày chiếu' });
  }
  const isShowtimeExist = await Showtime.findOne({
    movie,
    room,
    theater,
    startAt,
  });
  if (isShowtimeExist) {
    res.status(400).json({ msg: 'Suất chiếu này bị trùng lặp.' });
    return;
  }
  const showtime = await Showtime.create({ ...req.body });
  res.status(400).json({ msg: 'Tạo suất chiếu thành công', showtime });
};

export const getShowtimesByDate: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { movieId, theaterId } = req.query;

  const showtimes = await Showtime.find({
    movie: movieId,
    theater: theaterId,
  }).sort({ startAt: 1 });

  const grouped: Record<string, any[]> = {};
  showtimes.forEach((showtime) => {
    //Tạo date theo ngày tháng năm
    const date = new Date(showtime.startAt).toISOString().slice(0, 10);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(showtime);
  });

  const formattedShowtimes = Object.entries(grouped).map(
    ([date, showtimes]) => ({
      date,
      showtimes,
    }),
  );

  res.status(200).json({ showtimes: formattedShowtimes });
};

export const getAllSeatInShowtime: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { showtimeId } = req.params;

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    res.status(404).json({ msg: 'Suất chiếu không tồn tại' });
    return;
  }

  const allSeats = await Seat.find({ room: showtime.room });

  const bookings = await Booking.find({
    showtime: showtimeId,
  }).select('seats');

  const bookedSeatIds: string[] = [];
  bookings.forEach((booking) => {
    booking.seats.forEach((s) => {
      bookedSeatIds.push(s.seat.toString());
    });
  });

  const seatsWithStatus = allSeats.map((seat) => ({
    ...seat.toObject(),
    isBooked: bookedSeatIds.includes(seat._id.toString()),
  }));

  res.status(200).json({
    showtime,
    seats: seatsWithStatus,
  });
};
