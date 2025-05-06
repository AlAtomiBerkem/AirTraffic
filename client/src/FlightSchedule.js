import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FlightSchedule.css"; // Создайте этот файл для стилей

const FlightSchedule = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const API_KEY = process.env.REACT_APP_YANDEX_API_KEY;
                const stationCode = "s9600379";
                const formattedDate = currentDate.toISOString().split('T')[0];
                const url = `http://localhost:5000/api/flights?station=${stationCode}&date=${formattedDate}`;

                const response = await axios.get(url);
                setFlights(response.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка:", err);
                setError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
                setLoading(false);
            }
        };

        fetchFlights();
    }, [currentDate]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatFlightDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('ru-RU', options);
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
            <header className="board-header">
                <h1>
                    <span className="airport-code">KZN</span>
                    <span className="airport-name">Аэропорт Казань</span>
                </h1>
                <div className="board-info">
                    <div className="board-title">Табло вылетов</div>
                    <div className="current-date">{formatFlightDate(currentDate)}</div>
                </div>
            </header>

            <div className="flight-table">
                <div className="table-header">
                    <div className="col-time">Время</div>
                    <div className="col-number">Рейс</div>
                    <div className="col-destination">Направление</div>
                    <div className="col-airline">Авиакомпания</div>
                    <div className="col-terminal">Терминал</div>
                    <div className="col-status">Статус</div>
                </div>

                {flights.length > 0 ? (
                    flights.map((flight, index) => (
                        <div key={index} className="flight-row">
                            <div className="col-time">
                                <span className="time">{formatTime(flight.departure)}</span>
                            </div>
                            <div className="col-number">
                                <span className="flight-number">{flight.thread.number}</span>
                            </div>
                            <div className="col-destination">
                                <div className="city">{flight.thread.title.split(' — ')[1]}</div>
                                <div className="airport">{flight.thread.short_title}</div>
                            </div>
                            <div className="col-airline">
                                <div className="airline-logo">
                                    <img
                                        src={`https://rasp.yandex.ru/static/images/airline/${flight.thread.carrier.code}.svg`}
                                        alt={flight.thread.carrier.title}
                                    />
                                </div>
                                <div className="airline-name">{flight.thread.carrier.title}</div>
                            </div>
                            <div className="col-terminal">
                                {flight.terminal && flight.terminal !== "NULL" ? (
                                    <span className="terminal-badge">{flight.terminal}</span>
                                ) : '—'}
                            </div>
                            <div className="col-status">
                                <span className={`status ${flight.status ? 'delayed' : 'on-time'}`}>
                                    {flight.status || 'По расписанию'}
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

            <footer className="board-footer">
                <p>Обновлено: {new Date().toLocaleTimeString()}</p>
                <p>Аэропорт Казань имени Габдуллы Тукая</p>
            </footer>
        </div>
    );
};

export default FlightSchedule;