import React from "react";
import "./FlightSchedule.css";
import { useFlightSchedule, formatTime } from "../lib/useFlightSchedule";

const FlightSchedule = () => {
    const { flights, loading, error } = useFlightSchedule();

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
                <div className="col-time">
                    </div>
                <div className="col-destination">
                    </div>
                <div className="col-number">
                    </div>
                <div className="col-status">
                    </div>
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