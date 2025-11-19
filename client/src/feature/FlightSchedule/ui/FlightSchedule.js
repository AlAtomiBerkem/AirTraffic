import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FlightSchedule.css";
import App from "../../../app/App";

    const FlightSchedule = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const stationCode = "s9600379";
                const now = new Date();
                const formattedDate = now.toISOString().split('T')[0];
                const limitData = 8;

                const url = `http://localhost:5000/api/flights?station=${stationCode}&date=${formattedDate}&limit=${limitData}`;

                const response = await axios.get(url);

                const filteredFlights = (response.data || [])
                    .filter(flight => {
                        const departureTime = new Date(flight.departure);
                        return departureTime >= now;
                    })
                    .slice(0, 8)
                    .map(flight => {
                        return {
                            ...flight,
                            status: determineFlightStatus(flight)
                        };
                    });

                setFlights(filteredFlights);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка:", err);
                setError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const determineFlightStatus = (flight) => {
        const now = new Date();
        const scheduledDeparture = new Date(flight.departure);

        if (flight.is_cancelled || flight.cancelled) {
            return { text: 'Отменен', className: 'cancelled' };
        }
        const actualDeparture = flight.actual_departure ? new Date(flight.actual_departure) : scheduledDeparture;
        const delayInMinutes = (actualDeparture - scheduledDeparture) / (1000 * 60);

        if (delayInMinutes > 15) {
            return {
                text: `Задерживается ${Math.round(delayInMinutes)} мин`,
                className: 'delayed'
            };
        }
        if (scheduledDeparture < now && !flight.has_departed) {
            return { text: 'Задерживается', className: 'delayed' };
        }
        return { text: 'По расписанию', className: 'on-time' };
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Загрузка расписания рейсов...</p>
        </div>
    );

    if (error) return (
        <div className="error-screen">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
    );

    return (
        <div className="flight-board">
            <div className="table-header">
                <div className="col-time">Время</div>
                <div className="col-destination">Направление</div>
                <div className="col-number">Рейс</div>
                <div className="col-status">Статус</div>
            </div>

            {flights.length > 0 ? (
                flights.map((flight, index) => (
                    <div key={index} className="flight-row">
                        <div className="col-time">
                            <span className="time">{formatTime(flight.departure)}</span>
                        </div>
                        <div className="col-destination">
                            <div className="city">
                                {flight.thread.title.split(' — ')[1] || flight.thread.title}
                            </div>
                        </div>
                        <div className="col-number">
                            <span className="flight-number">{flight.thread.number}</span>
                        </div>
                        <div className="col-status">
                            <span className={`status ${flight.status.className}`}>
                                {flight.status.text}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-flights">
                    <p>На сегодня рейсов не запланировано</p>
                </div>
            )}
        </div>
    );
};

export default FlightSchedule;