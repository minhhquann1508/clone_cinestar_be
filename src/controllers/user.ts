import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import User from '../models/User';
import { FilterQuery } from 'mongoose';
