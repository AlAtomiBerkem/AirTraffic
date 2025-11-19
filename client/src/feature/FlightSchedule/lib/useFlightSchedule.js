import { useEffect, useState } from "react";
import axios from "axios";

const STATION_CODE = "s9600379";
const FLIGHTS_LIMIT = 8;

const determineFlightStatus = (flight, now) => {
    const scheduledDeparture = new Date(flight.departure);

    if (flight.is_cancelled || flight.cancelled) {
        return { text: "Отменен", className: "cancelled" };
    }

    const actualDeparture = flight.actual_departure
        ? new Date(flight.actual_departure)
        : scheduledDeparture;
    const delayInMinutes = (actualDeparture - scheduledDeparture) / (1000 * 60);

    if (delayInMinutes > 15) {
        return {
            text: `Задерживается ${Math.round(delayInMinutes)} мин`,
            className: "delayed",
        };
    }

    if (scheduledDeparture < now && !flight.has_departed) {
        return { text: "Задерживается", className: "delayed" };
    }

    return { text: "По расписанию", className: "on-time" };
};

const filterAndFormatFlights = (data, now) =>
    (data || [])
        .filter((flight) => new Date(flight.departure) >= now)
        .slice(0, FLIGHTS_LIMIT)
        .map((flight) => ({
            ...flight,
            status: determineFlightStatus(flight, now),
        }));

export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const useFlightSchedule = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            const now = new Date();
            const formattedDate = now.toISOString().split("T")[0];
            const url = `http://localhost:5000/api/flights?station=${STATION_CODE}&date=${formattedDate}&limit=${FLIGHTS_LIMIT}`;

            try {
                const response = await axios.get(url);
                setFlights(filterAndFormatFlights(response.data, now));
            } catch (err) {
                console.error("Ошибка:", err);
                setError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    return { flights, loading, error };
};


