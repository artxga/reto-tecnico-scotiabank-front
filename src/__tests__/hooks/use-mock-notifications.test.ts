import { renderHook, act } from "@testing-library/react";
import { useMockNotifications } from "@/hooks/use-mock-notifications";

jest.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ t: (k: string) => k, language: "en" }),
}));

describe("useMockNotifications", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should initialize with default notifications", () => {
    const { result } = renderHook(() => useMockNotifications());

    expect(result.current.notifications.length).toBe(2);
    expect(result.current.unreadCount).toBe(1); // One is read, one is unread
  });

  it("should mark all as read", () => {
    const { result } = renderHook(() => useMockNotifications());

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications[0].read).toBe(true);
  });

  it("should mark a single notification as read by id", () => {
    const { result } = renderHook(() => useMockNotifications());

    act(() => {
      result.current.markAsRead("1");
    });

    expect(result.current.unreadCount).toBe(0);
  });

  it("should clear all notifications", () => {
    const { result } = renderHook(() => useMockNotifications());

    act(() => {
      result.current.clearAllNotifications();
    });

    expect(result.current.notifications.length).toBe(0);
  });

  it("should add a new notification after 45 seconds", () => {
    const { result } = renderHook(() => useMockNotifications());

    act(() => {
      jest.advanceTimersByTime(45000);
    });

    expect(result.current.notifications.length).toBe(3);
    expect(result.current.unreadCount).toBe(2); // The new one is unread
  });

  it("should translate notification titles", () => {
    const { result } = renderHook(() => useMockNotifications());

    expect(result.current.translateNotificationTitle("Nueva Solicitud")).toBe(
      "dashboard.recentActivity.newEvent",
    );
    expect(result.current.translateNotificationTitle("Actualización de Estado")).toBe(
      "dashboard.recentActivity.statusUpdated",
    );
    expect(result.current.translateNotificationTitle("Solicitud Cerrada")).toBe(
      "requests.detail.closeRequest",
    );
    expect(result.current.translateNotificationTitle("Other")).toBe("Other");
  });

  it("should translate notification descriptions to English", () => {
    const { result } = renderHook(() => useMockNotifications());

    expect(
      result.current.translateNotificationDesc("La solicitud #42a fue Aprobada por Operaciones."),
    ).toBe("Request #42a was Approved by Operations.");
    expect(result.current.translateNotificationDesc("Other")).toBe("Other");
  });

  it("should translate notification times to English", () => {
    const { result } = renderHook(() => useMockNotifications());

    expect(result.current.translateNotificationTime("Hace un momento")).toBe(
      "dashboard.recentActivity.time.now",
    );
    expect(result.current.translateNotificationTime("Hace 1 hora")).toBe(
      "dashboard.recentActivity.time.hour",
    );
    expect(result.current.translateNotificationTime("Other")).toBe("Other");
  });
});
