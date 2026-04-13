jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/repositories/showtimeRepository");

import {
  addShowtimeAction,
  editShowtimeAction,
  deleteShowtimeAction,
} from "@/app/actions/showtimeActions";
import { auth } from "@/auth";
import * as showtimeRepo from "@/lib/repositories/showtimeRepository";

const mockAuth = auth as jest.Mock;
const mockCheckConflicts = showtimeRepo.checkShowtimeConflicts as jest.Mock;
const mockGetShowtimeById = showtimeRepo.getShowtimeById as jest.Mock;
const mockInsertShowtime = showtimeRepo.insertShowtime as jest.Mock;
const mockInsertShowSeats = showtimeRepo.insertShowSeats as jest.Mock;
const mockUpdateShowtime = showtimeRepo.updateShowtime as jest.Mock;
const mockRebuildShowSeats = showtimeRepo.rebuildShowSeats as jest.Mock;
const mockDeleteShowtime = showtimeRepo.deleteShowtime as jest.Mock;

const adminSession = { user: { id: "admin-1", role: "ADMIN" } };

const validData = {
  movieId: 1,
  showroomId: 2,
  datetime: "2026-05-01T14:00:00.000Z",
  duration: 120,
};

// ---------------------------------------------------------------------------
// addShowtimeAction
// ---------------------------------------------------------------------------
describe("addShowtimeAction", () => {
  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await addShowtimeAction(validData)).toEqual({ error: "Forbidden" });
  });

  it("returns Forbidden for non-ADMIN role", async () => {
    mockAuth.mockResolvedValue({ user: { role: "CUSTOMER" } });
    expect(await addShowtimeAction(validData)).toEqual({ error: "Forbidden" });
  });

  it("returns error when movieId is missing", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addShowtimeAction({ ...validData, movieId: 0 })).toEqual({
      error: "All fields are required.",
    });
  });

  it("returns error when duration is zero", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addShowtimeAction({ ...validData, duration: 0 })).toEqual({
      error: "All fields are required.",
    });
  });

  it("returns error when duration is a decimal", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addShowtimeAction({ ...validData, duration: 90.5 })).toEqual({
      error: "Duration must be a positive whole number.",
    });
  });

  it("returns error when datetime is invalid", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await addShowtimeAction({ ...validData, datetime: "not-a-date" }),
    ).toEqual({ error: "Invalid date/time." });
  });

  it("returns conflict error when showroom is already booked", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockCheckConflicts.mockResolvedValue(true);
    expect(await addShowtimeAction(validData)).toEqual({
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    });
  });

  it("inserts showtime and returns success", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockCheckConflicts.mockResolvedValue(false);
    mockInsertShowtime.mockResolvedValue("show-abc");
    mockInsertShowSeats.mockResolvedValue(undefined);
    expect(await addShowtimeAction(validData)).toEqual({
      success: true,
      show_id: "show-abc",
    });
  });

  it("returns error when repository throws", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockCheckConflicts.mockRejectedValue(new Error("DB error"));
    expect(await addShowtimeAction(validData)).toEqual({
      error: "Failed to add showtime. Please try again.",
    });
  });
});

// ---------------------------------------------------------------------------
// editShowtimeAction
// ---------------------------------------------------------------------------
describe("editShowtimeAction", () => {
  const showId = "show-1";

  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await editShowtimeAction(showId, validData)).toEqual({
      error: "Forbidden",
    });
  });

  it("returns error when showId is empty", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await editShowtimeAction("", validData)).toEqual({
      error: "All fields are required.",
    });
  });

  it("returns error for invalid datetime", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(
      await editShowtimeAction(showId, { ...validData, datetime: "bad" }),
    ).toEqual({ error: "Invalid date/time." });
  });

  it("returns error when showtime is not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetShowtimeById.mockResolvedValue(null);
    expect(await editShowtimeAction(showId, validData)).toEqual({
      error: "Showtime not found.",
    });
  });

  it("returns conflict error when showroom is already booked", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetShowtimeById.mockResolvedValue({ showroom_id: 2 });
    mockCheckConflicts.mockResolvedValue(true);
    expect(await editShowtimeAction(showId, validData)).toEqual({
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    });
  });

  it("updates and returns success without rebuilding seats when showroom unchanged", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetShowtimeById.mockResolvedValue({ showroom_id: 2 });
    mockCheckConflicts.mockResolvedValue(false);
    mockUpdateShowtime.mockResolvedValue(undefined);
    expect(await editShowtimeAction(showId, validData)).toEqual({
      success: true,
    });
    expect(mockRebuildShowSeats).not.toHaveBeenCalled();
  });

  it("rebuilds seats when showroom changes", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetShowtimeById.mockResolvedValue({ showroom_id: 99 });
    mockCheckConflicts.mockResolvedValue(false);
    mockUpdateShowtime.mockResolvedValue(undefined);
    mockRebuildShowSeats.mockResolvedValue(undefined);
    expect(await editShowtimeAction(showId, validData)).toEqual({
      success: true,
    });
    expect(mockRebuildShowSeats).toHaveBeenCalledWith(showId, 2);
  });
});

// ---------------------------------------------------------------------------
// deleteShowtimeAction
// ---------------------------------------------------------------------------
describe("deleteShowtimeAction", () => {
  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await deleteShowtimeAction("show-1")).toEqual({
      error: "Forbidden",
    });
  });

  it("returns error when showId is empty", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await deleteShowtimeAction("")).toEqual({
      error: "Showtime ID is required.",
    });
  });

  it("returns error when showtime is not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetShowtimeById.mockResolvedValue(null);
    expect(await deleteShowtimeAction("nonexistent")).toEqual({
      error: "Showtime not found.",
    });
  });

  it("deletes showtime and returns success", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetShowtimeById.mockResolvedValue({ show_id: "show-1" });
    mockDeleteShowtime.mockResolvedValue(undefined);
    expect(await deleteShowtimeAction("show-1")).toEqual({ success: true });
    expect(mockDeleteShowtime).toHaveBeenCalledWith("show-1");
  });
});
