jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/services/showtimeService");

import {
  addShowtimeAction,
  editShowtimeAction,
  deleteShowtimeAction,
} from "@/app/actions/showtimeActions";
import { auth } from "@/auth";

const mockAuth = auth as jest.Mock;
const showtimeService = jest.requireMock("@/lib/services/showtimeService") as {
  addShowtime: jest.Mock;
  editShowtime: jest.Mock;
  removeShowtime: jest.Mock;
};
const mockAddShowtime = showtimeService.addShowtime as jest.Mock;
const mockEditShowtime = showtimeService.editShowtime as jest.Mock;
const mockRemoveShowtime = showtimeService.removeShowtime as jest.Mock;

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
    mockAddShowtime.mockResolvedValue({
      ok: false,
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    });
    expect(await addShowtimeAction(validData)).toEqual({
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    });
  });

  it("inserts showtime and returns success", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockAddShowtime.mockResolvedValue({ ok: true, show_id: "show-abc" });
    expect(await addShowtimeAction(validData)).toEqual({
      success: true,
      show_id: "show-abc",
    });
  });

  it("throws when service throws", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockAddShowtime.mockRejectedValue(new Error("DB error"));
    await expect(addShowtimeAction(validData)).rejects.toThrow("DB error");
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
    mockEditShowtime.mockResolvedValue({
      ok: false,
      error: "Showtime not found.",
    });
    expect(await editShowtimeAction(showId, validData)).toEqual({
      error: "Showtime not found.",
    });
  });

  it("returns conflict error when showroom is already booked", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockEditShowtime.mockResolvedValue({
      ok: false,
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    });
    expect(await editShowtimeAction(showId, validData)).toEqual({
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    });
  });

  it("updates and returns success", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockEditShowtime.mockResolvedValue({ ok: true });
    expect(await editShowtimeAction(showId, validData)).toEqual({
      success: true,
    });
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
    mockRemoveShowtime.mockResolvedValue({
      ok: false,
      error: "Showtime not found.",
    });
    expect(await deleteShowtimeAction("nonexistent")).toEqual({
      error: "Showtime not found.",
    });
  });

  it("deletes showtime and returns success", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRemoveShowtime.mockResolvedValue({ ok: true });
    expect(await deleteShowtimeAction("show-1")).toEqual({ success: true });
    expect(mockRemoveShowtime).toHaveBeenCalledWith("show-1");
  });
});
