document.addEventListener('DOMContentLoaded', () => {
    // Переносим функцию loadData сюда, чтобы она была доступна глобально
    function loadData(url, listId, title) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const listContainer = document.getElementById(listId);
                const titleContainer = document.getElementById('content-title');
                document.getElementById("content").classList.remove("hidden")
                listContainer.innerHTML = ''; // Очистить контейнер перед загрузкой данных
                titleContainer.textContent = title; // Установить заголовок

                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'item';

                    if (item.hotelId) {
                        div.innerHTML = `<p>${item.hotelId} Отель: ${item.name || ''}, город: ${item.location || ''}, рейтинг: ${item.rating || ''}, ${item.distance || ''} км до центра</p>`;
                    } else if (item.roomId) {
                        div.innerHTML = `<p>${item.roomId} Номер типа ${item.roomType || ''} в отеле ${item.hotel.name} (${item.hotel.hotelId}), стоимость: ${item.price || ''} руб, площадью ${item.size} кв.м</p>`;
                    } else if (item.guestId) {
                        div.innerHTML = `<p>${item.guestId} Постоялец: ${item.firstName || ''} ${item.lastName || ''}, телефон: ${item.phoneNumber || ''}, email: ${item.email || ''} в отеле ${item.hotel.name} (${item.hotel.hotelId})</p>`;
                    } else if (item.bookingId) {
                        div.innerHTML = `<p>${item.bookingId} Бронирование: ${item.room.roomId || ''} номер типа ${item.room.roomType || ''} в отеле ${item.room.hotel.name} (${item.room.hotel.hotelId}) арендован постояльцем ${item.guest.firstName || ''} ${item.guest.lastName || ''} (${item.guest.guestId}). Заезд: ${item.checkInDate || ''}, выезд: ${item.checkOutDate || ''}</p>`;
                    } else if (item.provisionId) {
                        div.innerHTML = `<p>${item.provisionId} Услуга: ${item.provisionName || ''} в отеле ${item.hotel.name} (${item.hotel.hotelId}), цена: ${item.price || ''} руб</p>`;
                    } else if (item.bookingProvisionId) {
                        div.innerHTML = `<p>${item.bookingProvisionId} Бронирование услуги: ${item.provision?.provisionName || ''} для номера ${item.booking?.room?.roomId || ''} в отеле ${item.booking.room.hotel.name} (${item.booking.room.hotel.hotelId})</p>`;
                    }
                    listContainer.appendChild(div);
                });
            })
    }

    // Навигационные ссылки
    const navLinks = document.querySelectorAll('.nav-bar a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const listId = 'content';

            switch (targetId) {
                case 'hotels':
                    loadData('/api/univer/hotels', listId, 'Список отелей');
                    break;
                case 'rooms':
                    loadData('/api/univer/rooms', listId, 'Список номеров');
                    break;
                case 'guests':
                    loadData('/api/univer/guests', listId, 'Список постояльцев');
                    break;
                case 'bookings':
                    loadData('/api/univer/bookings', listId, 'Список бронирований');
                    break;
                case 'provisions':
                    loadData('/api/univer/provisions', listId, 'Список услуг');
                    break;
                case 'bookingProvisions':
                    loadData('/api/univer/bookingProvisions', listId, 'Бронирование услуг');
                    break;
                default:
                    console.error('Неизвестная секция');
            }
        });
    });

    const sections = {
        hotels: document.getElementById('hotels'),
        guests: document.getElementById('guests'),
        rooms: document.getElementById('rooms'),
        bookings: document.getElementById('bookings'),
        provisions: document.getElementById('provisions'),
        bookingProvisions: document.getElementById('bookingProvisions'),
    };

    // Функция для переключения видимости секций
    function showSection(sectionKey) {
        // Скрыть все секции
        Object.values(sections).forEach(section => section.classList.add('hidden'));
        // Показать выбранную секцию
        if (sections[sectionKey]) {
            sections[sectionKey].classList.remove('hidden');
        }
    }

    // Добавляем обработчики событий для навигационных ссылок
    document.querySelectorAll('.nav-bar a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // Извлекаем ID из ссылки
            showSection(targetId); // Показываем соответствующую секцию

            // Загрузка данных для секции
            switch (targetId) {
                case 'hotels':
                    loadData('/api/univer/hotels', hotels, 'Список отелей');
                    break;
                case 'guests':
                    loadData('/api/univer/guests', 'guest-list', 'Список постояльцев');
                    break;
                case 'rooms':
                    loadData('/api/univer/rooms', 'room-list', 'Список номеров');
                    break;
                case 'bookings':
                    loadData('/api/univer/bookings', 'booking-list', 'Список бронирований');
                    break;
                case 'provisions':
                    loadData('/api/univer/provisions', 'provisions-list', 'Список услуг');
                    break;
                case 'bookingProvisions':
                    loadData('/api/univer/bookingProvisions', 'booking-provisions-list', 'Список услуг');
                    break;
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Функция для поиска отеля по ID
    function findHotelById() {
        const hotelId = document.getElementById('hotelId').value.trim();

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный положительный ID отеля');
            return;
        }

        fetch(`/api/univer/hotels/id/${hotelId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Отель не найден');
                }
                return response.json();
            })
            .then(hotel => {
                if (hotel) {
                    displayHotels([hotel]); // Передаем в displayHotels массив с одним отелем
                }
            })
            .catch(error => alert(error.message));
    }

    // Функция для поиска отелей по местоположению
    function findHotelByLocation() {
        const location = document.getElementById('hotelLocation').value.trim();

        if (!location) {
            alert('Пожалуйста, введите местоположение');
            return;
        }

        fetch(`/api/univer/hotels/location/${location}`)
            .then(response => response.json())
            .then(hotels => {
                if (Array.isArray(hotels) && hotels.length > 0) {
                    displayHotels(hotels); // Передаем массив отелей в displayHotels
                } else {
                    alert('Отели не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке отелей по местоположению:', error));
    }

    // Функция для фильтрации отелей по рейтингу
    function findHotelByRating() {
        const rating = document.getElementById('hotelRating').value.trim();

        if (!rating || isNaN(rating) || rating <= 0 || rating > 5) {
            alert('Пожалуйста, введите корректный рейтинг (от 1 до 5)');
            return;
        }

        fetch(`/api/univer/hotels/rating/${rating}`)
            .then(response => response.json())
            .then(hotels => {
                if (Array.isArray(hotels) && hotels.length > 0) {
                    displayHotels(hotels); // Передаем массив отелей в displayHotels
                } else {
                    alert('Отели с таким рейтингом не найдены');
                }
            })
            .catch(error => console.error('Ошибка при фильтрации отелей по рейтингу:', error));
    }

    function findHotelByDistance() {
        const distance = document.getElementById('hotelDistance').value.trim();

        if (!distance || isNaN(distance) || distance <= 0) {
            alert('Пожалуйста, введите корректное расстояние');
            return;
        }

        fetch(`/api/univer/hotels/distance/${distance}`)
            .then(response => response.json())
            .then(hotels => {
                if (Array.isArray(hotels) && hotels.length > 0) {
                    displayHotels(hotels); // Передаем массив отелей в displayHotels
                } else {
                    alert('Отели с таким расстоянием не найдены');
                }
            })
            .catch(error => console.error('Ошибка при фильтрации отелей по расстоянию:', error));
    }

    // Функция для добавления нового отеля
    function saveHotel() {
        const name = document.getElementById('newHotelName').value.trim();
        const location = document.getElementById('newHotelLocation').value.trim();
        const rating = parseFloat(document.getElementById('newHotelRating').value.trim());

        if (!name || !location || isNaN(rating) || rating <= 0 || rating > 5) {
            alert("Все поля должны быть заполнены корректно! Убедитесь, что рейтинг от 1 до 5.");
            return;
        }

        const item = {
            name: name,
            location: location,
            rating: rating
        };

        fetch('/api/univer/hotels/saveHotel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при сохранении отеля');
                }
                return response.text();
            })
            .then(message => {
                alert(message);
                loadData('/api/univer/hotels', 'hotel-list', 'Список отелей');
            })
            .catch(error => console.error('Ошибка при сохранении отеля:', error));
    }

    // Функция для обновления отеля
    function updateHotel() {
        const hotelId = document.getElementById('updateHotelId').value.trim();
        const name = document.getElementById('updateHotelName').value.trim();
        const location = document.getElementById('updateHotelLocation').value.trim();
        const rating = parseFloat(document.getElementById('updateHotelRating').value.trim());

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert("Пожалуйста, введите корректный ID отеля для обновления");
            return;
        }

        if (!name || !location || isNaN(rating) || rating <= 0 || rating > 5) {
            alert("Все поля должны быть заполнены корректно! Убедитесь, что рейтинг от 1 до 5.");
            return;
        }

        const item = {
            hotelId: hotelId,
            name: name,
            location: location,
            rating: rating
        };

        fetch('/api/univer/hotels/updateHotel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при обновлении отеля');
                }
                return response.text();
            })
            .then(message => {
                alert(message);
                loadData('/api/univer/hotels', 'hotel-list', 'Список отелей');
            })
            .catch(error => console.error('Ошибка при обновлении отеля:', error));
    }

    // Функция для удаления отеля по ID
    function deleteHotel() {
        const hotelId = document.getElementById('deleteHotelId').value.trim();

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля для удаления');
            return;
        }

        fetch(`/api/univer/hotels/deleteHotel/${hotelId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    alert('Ошибка при удалении отеля');
                    throw new Error();
                }
                alert('Отель успешно удален');
                loadData('/api/univer/hotels', 'hotel-list', 'Список отелей');
            })
            .catch(error => console.error('Ошибка при удалении отеля:', error));
    }

    function deleteHotelCascade() {
        const hotelId = document.getElementById('deleteHotelId').value.trim();

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля для удаления');
            return;
        }

        fetch(`/api/univer/hotels/deleteHotelCascade/${hotelId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    alert('Ошибка при удалении отеля');
                    throw new Error();
                }
                alert('Отель успешно удален');
                loadData('/api/univer/hotels', 'hotel-list', 'Список отелей');
            })
            .catch(error => console.error('Ошибка при удалении отеля:', error));
    }

    function displayHotels(hotels) {
        const hotelsContainer = document.getElementById('content');
        if (!hotelsContainer) {
            console.error('Контейнер для отелей не найден');
            return;
        }

        hotelsContainer.innerHTML = '';  // Очистить контейнер перед добавлением нового содержимого

        if (hotels.length === 0) {
            hotelsContainer.innerHTML = '<p>Нет отелей для отображения</p>';
            return;
        }

        hotels.forEach(item => {
            const hotelElement = document.createElement('div');
            hotelElement.className = 'item';
            hotelElement.style.padding="10px";
            hotelElement.style.fontSize="16px"
            hotelElement.innerHTML = `<p>${item.hotelId} Отель: ${item.name || ''}, город: ${item.location || ''}, рейтинг: ${item.rating || ''}, ${item.distance || ''} км до центра</p>`;
            hotelsContainer.appendChild(hotelElement);
        });
    }

    window.findHotelById = findHotelById;
    window.findHotelByLocation = findHotelByLocation;
    window.findHotelByRating = findHotelByRating;
    window.findHotelByDistance = findHotelByDistance;
    window.saveHotel = saveHotel;
    window.updateHotel = updateHotel;
    window.deleteHotel = deleteHotel;
    window.deleteHotelCascade=deleteHotelCascade;
});



document.addEventListener('DOMContentLoaded', () => {
    // Регулярное выражение для проверки email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // Регулярное выражение для проверки номера телефона (например, в формате +7 (999) 999-99-99)
    const phoneRegex = /^\+?\d{1,3}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

    // Функция для поиска постояльца по ID
    function findGuestById() {
        const guestId = document.getElementById('guestId').value.trim();

        if (!guestId || isNaN(guestId) || guestId <= 0) {
            alert('Пожалуйста, введите корректный ID постояльца');
            return;
        }

        fetch(`/api/univer/guests/id/${guestId}`)
            .then(response => response.json())
            .then(guest => {
                if (guest) {
                    displayGuests([guest]);
                } else {
                    alert('Постоялец не найден');
                }
            })
            .catch(error => console.error('Ошибка при загрузке постояльца по ID:', error));
    }

    // Функция для поиска постояльца по email
    function findGuestByEmail() {
        const email = document.getElementById('guestEmail').value.trim();

        if (!email || !emailRegex.test(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }

        fetch(`/api/univer/guests/email/${email}`)
            .then(response => response.json())
            .then(guest => {
                if (guest) {
                    displayGuests([guest]);
                } else {
                    alert('Постоялец с таким email не найден');
                }
            })
            .catch(error => console.error('Ошибка при загрузке постояльца по email:', error));
    }

    // Функция для поиска постояльца по номеру телефона
    function findGuestByPhoneNumber() {
        const phoneNumber = document.getElementById('guestPhoneNumber').value.trim();

        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }

        fetch(`/api/univer/guests/phoneNumber/${phoneNumber}`)
            .then(response => response.json())
            .then(guest => {
                if (guest) {
                    displayGuests([guest]);
                } else {
                    alert('Постоялец с таким номером телефона не найден');
                }
            })
            .catch(error => console.error('Ошибка при загрузке постояльца по номеру телефона:', error));
    }

    function findGuestByHotelId() {
        const hotelId = document.getElementById('findGuestByHotelId').value.trim();
        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля');
            return;
        }

        fetch(`/api/univer/guests/hotelId/${hotelId}`)
            .then(response => response.json())
            .then(guests => {
                if (Array.isArray(guests) && guests.length > 0) {
                    displayGuests(guests);
                } else {
                    alert('Постояльцы в этом отеле не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке постояльцов по ID отеля:', error));
    }

    // Функция для добавления нового постояльца
    function saveGuest() {
        const firstName = document.getElementById('newGuestFirstName').value.trim();
        const lastName = document.getElementById('newGuestLastName').value.trim();
        const phoneNumber = document.getElementById('newGuestPhoneNumber').value.trim();
        const email = document.getElementById('newGuestEmail').value.trim();

        if (!firstName || !lastName || !phoneNumber || !email) {
            alert("Все поля должны быть заполнены");
            return;
        }

        if (!phoneRegex.test(phoneNumber)) {
            alert("Пожалуйста, введите корректный номер телефона");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Пожалуйста, введите корректный email");
            return;
        }

        const guest = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email
        };

        fetch('/api/univer/guests/saveGuest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(guest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Отель с указанным ID не существует")) {
                    alert("Отель с указанным ID не существует");
                }
                loadData('/api/univer/guests', 'guest-list', 'Список постояльцев');
            })
            .catch(error => console.error('Ошибка при сохранении постояльца:', error));
    }

    // Функция для обновления постояльца
    function updateGuest() {
        const guestId = document.getElementById('updateGuestId').value.trim();
        const firstName = document.getElementById('updateGuestFirstName').value.trim();
        const lastName = document.getElementById('updateGuestLastName').value.trim();
        const phoneNumber = document.getElementById('updateGuestPhoneNumber').value.trim();
        const email = document.getElementById('updateGuestEmail').value.trim();

        if (!guestId || isNaN(guestId) || guestId <= 0) {
            alert("Пожалуйста, введите корректный ID постояльца для обновления");
            return;
        }

        if (!firstName || !lastName || !phoneNumber || !email) {
            alert("Все поля должны быть заполнены");
            return;
        }

        if (!phoneRegex.test(phoneNumber)) {
            alert("Пожалуйста, введите корректный номер телефона");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Пожалуйста, введите корректный email");
            return;
        }

        const guest = {
            guestId: guestId,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email
        };

        fetch('/api/univer/guests/updateGuest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(guest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Отель с указанным ID не существует")) {
                    alert("Отель с указанным ID не существует");
                }
                if(message.includes("Постоялец с указанным ID не существует")) {
                    alert("Постоялец с указанным ID не существует");
                }
                loadData('/api/univer/guests', 'guest-list', 'Список постояльцев');
            })
            .catch(error => console.error('Ошибка при обновлении постояльца:', error));
    }

    // Функция для удаления постояльца по ID
    function deleteGuest() {
        const guestId = document.getElementById('deleteGuestId').value.trim();

        if (!guestId || isNaN(guestId) || guestId <= 0) {
            alert('Пожалуйста, введите корректный ID постояльца для удаления');
            return;
        }

        fetch(`/api/univer/guests/deleteGuest/${guestId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if(!response.ok) {
                    alert('Ошибка при удалении постояльца');
                    throw new Error();
                }
                alert("Постоялец успешно удален");
                loadData('/api/univer/guests', 'guest-list', 'Список постояльцев');
            })
            .catch(error => console.error('Ошибка при удалении постояльца:', error));
    }

    function deleteGuestCascade() {
        const guestId = document.getElementById('deleteGuestId').value.trim();

        if (!guestId || isNaN(guestId) || guestId <= 0) {
            alert('Пожалуйста, введите корректный ID постояльца для удаления');
            return;
        }

        fetch(`/api/univer/guests/deleteGuestCascade/${guestId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if(!response.ok) {
                    alert('Ошибка при удалении постояльца');
                    throw new Error();
                }
                alert("Постоялец успешно удален");
                loadData('/api/univer/guests', 'guest-list', 'Список постояльцев');
            })
            .catch(error => console.error('Ошибка при удалении постояльца:', error));
    }

    // Функция для отображения списка постояльцев
    function displayGuests(guests) {
        const guestList = document.getElementById('content');
        guestList.innerHTML = '';
        guests.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<p>${item.guestId} Постоялец: ${item.firstName} ${item.lastName}, телефон: ${item.phoneNumber}, email: ${item.email}  в отеле ${item.hotel.name} (${item.hotel.hotelId})</p>`;
            guestList.appendChild(div);
        });
    }

    // Подключение функций к глобальной области
    window.findGuestById = findGuestById;
    window.findGuestByEmail = findGuestByEmail;
    window.findGuestByPhoneNumber = findGuestByPhoneNumber;
    window.findGuestByHotelId = findGuestByHotelId;
    window.saveGuest = saveGuest;
    window.updateGuest = updateGuest;
    window.deleteGuest = deleteGuest;
    window.deleteGuestCascade = deleteGuestCascade;
});

document.addEventListener('DOMContentLoaded', () => {
    // Функция для поиска номера по ID
    function findRoomById() {
        const roomId = document.getElementById('roomId').value.trim();
        if (!roomId || isNaN(roomId) || roomId <= 0) {
            alert('Пожалуйста, введите корректный ID номера');
            return;
        }

        fetch(`/api/univer/rooms/id/${roomId}`)
            .then(response => response.json())
            .then(room => {
                if (room) {
                    displayRooms([room]);
                } else {
                    alert('Номер не найден');
                }
            })
            .catch(error => alert('Номер не найден'));
    }

    // Функция для поиска номеров по типу
    function findRoomsByType() {
        const roomType = document.getElementById('roomType').value.trim();
        if (!roomType) {
            alert('Пожалуйста, введите тип номера');
            return;
        }

        fetch(`/api/univer/rooms/roomType/${roomType}`)
            .then(response => response.json())
            .then(rooms => {
                if (Array.isArray(rooms) && rooms.length > 0) {
                    displayRooms(rooms);
                } else {
                    alert('Номера с таким типом не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке номеров по типу:', error));
    }

    // Функция для поиска номеров по ID отеля
    function findRoomsByHotelId() {
        const hotelId = document.getElementById('findRoomsByHotelId').value.trim();
        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля');
            return;
        }

        fetch(`/api/univer/rooms/hotelId/${hotelId}`)
            .then(response => response.json())
            .then(rooms => {
                if (Array.isArray(rooms) && rooms.length > 0) {
                    displayRooms(rooms);
                } else {
                    alert('Номера для этого отеля не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке номеров по ID отеля:', error));
    }

    function findRoomsBySize() {
        const size = document.getElementById('findRoomsBySize').value.trim();
        if (!size || isNaN(size) || size <= 0) {
            alert('Пожалуйста, введите корректную площадь');
            return;
        }

        fetch(`/api/univer/rooms/size/${size}`)
            .then(response => response.json())
            .then(rooms => {
                if (Array.isArray(rooms) && rooms.length > 0) {
                    displayRooms(rooms);
                } else {
                    alert('Номера с такой площадью не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке номеров по площади:', error));
    }

    // Функция для добавления нового номера
    function saveRoom() {
        const hotelId = document.getElementById('newRoomHotelId').value.trim();
        const roomType = document.getElementById('newRoomType').value.trim();
        const price = document.getElementById('newRoomPrice').value.trim();
        const size = document.getElementById('newRoomSize').value.trim();

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля');
            return;
        }

        if (!roomType) {
            alert('Пожалуйста, введите тип номера');
            return;
        }

        if (!price || isNaN(price) || price <= 0) {
            alert('Пожалуйста, введите корректную цену номера');
            return;
        }

        if (!size || isNaN(price) || size <= 10) {
            alert('Пожалуйста, введите корректную цену номера');
            return;
        }
        const roomRequest = { hotelId, roomType, price, size };

        fetch('/api/univer/rooms/saveRoom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Отель с указанным ID не существует")) {
                    alert("Отель с указанным ID не существует");
                }
                loadData('/api/univer/rooms', 'room-list', 'Список номеров');
            })
            .catch(error => console.error('Ошибка при добавлении номера:', error));
    }

    // Функция для обновления номера
    function updateRoom() {
        const roomId = document.getElementById('updateRoomId').value.trim();
        const hotelId = document.getElementById('updateRoomHotelId').value.trim();
        const roomType = document.getElementById('updateRoomType').value.trim();
        const price = document.getElementById('updateRoomPrice').value.trim();
        const size = document.getElementById('updateRoomSize').value.trim();

        if (!roomId || isNaN(roomId) || roomId <= 0) {
            alert('Пожалуйста, введите корректный ID номера для обновления');
            return;
        }

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля');
            return;
        }

        if (!roomType) {
            alert('Пожалуйста, введите новый тип номера');
            return;
        }

        if (!price || isNaN(price) || price <= 0) {
            alert('Пожалуйста, введите корректную цену номера');
            return;
        }

        if (!size || isNaN(price) || size <= 10) {
            alert('Пожалуйста, введите корректную цену номера');
            return;
        }

        const roomRequest = { roomId, hotelId, roomType, price, size };

        fetch('/api/univer/rooms/updateRoom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Отель с указанным ID не существует")) {
                    alert("Отель с указанным ID не существует");
                }
                if(message.includes("Номер с указанным ID не существует")) {
                    alert("Номер с указанным ID не существует");
                }
                loadData('/api/univer/rooms', 'room-list', 'Список номеров');
            })
            .catch(error => console.error('Ошибка при обновлении номера:', error));
    }

    // Функция для удаления номера
    function deleteRoom() {
        const roomId = document.getElementById('deleteRoomId').value.trim();
        if (!roomId || isNaN(roomId) || roomId <= 0) {
            alert('Пожалуйста, введите корректный ID номера для удаления');
            return;
        }

        fetch(`/api/univer/rooms/deleteRoom/${roomId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении номера");
                    throw new Error();
                }
                alert("Номер успешно удален");
                loadData('/api/univer/rooms', 'room-list', 'Список номеров');
            })
            .catch(error => console.error('Ошибка при удалении номера:', error));
    }

    function deleteRoomCascade() {
        const roomId = document.getElementById('deleteRoomId').value.trim();
        if (!roomId || isNaN(roomId) || roomId <= 0) {
            alert('Пожалуйста, введите корректный ID номера для удаления');
            return;
        }

        fetch(`/api/univer/rooms/deleteRoomCascade/${roomId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении номера");
                    throw new Error();
                }
                alert("Номер успешно удален");
                loadData('/api/univer/rooms', 'room-list', 'Список номеров');
            })
            .catch(error => console.error('Ошибка при удалении номера:', error));
    }

    // Функция для отображения списка номеров
    function displayRooms(rooms) {
        const roomList = document.getElementById('content');
        roomList.innerHTML = '';
        rooms.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<p>${item.roomId} Номер типа ${item.roomType || ''} в отеле ${item.hotel.name}(${item.hotel.hotelId}), стоимость: ${item.price || ''} руб, площадью ${item.size} кв.м</p>`;
            roomList.appendChild(div);
        });
    }

    // Подключение функций к глобальной области
    window.findRoomById = findRoomById;
    window.findRoomsByType = findRoomsByType;
    window.findRoomsByHotelId = findRoomsByHotelId;
    window.findRoomsBySize=findRoomsBySize;
    window.saveRoom = saveRoom;
    window.updateRoom = updateRoom;
    window.deleteRoom = deleteRoom;
    window.deleteRoomCascade = deleteRoomCascade;
});

document.addEventListener('DOMContentLoaded', () => {
    // Функция для поиска бронирования по ID
    function findBookingById() {
        const bookingId = document.getElementById('bookingId').value.trim();
        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования');
            return;
        }

        fetch(`/api/univer/bookings/id/${bookingId}`)
            .then(response => response.json())
            .then(booking => {
                if (booking) {
                    displayBookings([booking]);
                } else {
                    alert('Бронирование не найдено');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирования по ID:', error));
    }

    // Функция для поиска бронирований по ID постояльца
    function findBookingsByGuestId() {
        const guestId = document.getElementById('bookingByGuestId').value;
        console.log(guestId);
        if (!guestId || isNaN(guestId) || guestId <= 0) {
            alert('Пожалуйста, введите корректный ID постояльца');
            return;
        }

        fetch(`/api/univer/bookings/guestId/${guestId}`)
            .then(response => response.json())
            .then(bookings => {
                if (Array.isArray(bookings) && bookings.length > 0) {
                    displayBookings(bookings);
                } else {
                    alert('Бронирования для этого постояльца не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирований по ID постояльца:', error));
    }

    // Функция для поиска бронирований по ID номера
    function findBookingsByRoomId() {
        const roomId = document.getElementById('bookingByRoomId').value.trim();
        if (!roomId || isNaN(roomId) || roomId <= 0) {
            alert('Пожалуйста, введите корректный ID номера');
            return;
        }

        fetch(`/api/univer/bookings/roomId/${roomId}`)
            .then(response => response.json())
            .then(bookings => {
                if (Array.isArray(bookings) && bookings.length > 0) {
                    displayBookings(bookings);
                } else {
                    alert('Бронирования для этого номера не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирований по ID номера:', error));
    }

    // Функция для поиска бронирований по диапазону дат
    function findBookingsByDateRange() {
        const checkInDate = document.getElementById('checkInDate').value.trim();
        const checkOutDate = document.getElementById('checkOutDate').value.trim();

        if (!checkInDate || !checkOutDate) {
            alert('Пожалуйста, введите корректные даты');
            return;
        }

        fetch(`/api/univer/bookings/date/${checkInDate}/${checkOutDate}`)
            .then(response => response.json())
            .then(bookings => {
                if (Array.isArray(bookings) && bookings.length > 0) {
                    displayBookings(bookings);
                } else {
                    alert('Бронирования для данного диапазона дат не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирований по датам:', error));
    }

    // Функция для добавления нового бронирования
    function saveBooking() {
        const guestId = document.getElementById('newGuestId').value.trim();
        const roomId = document.getElementById('newRoomId').value.trim();
        const checkInDate = document.getElementById('newCheckInDate').value.trim();
        const checkOutDate = document.getElementById('newCheckOutDate').value.trim();

        if (!guestId || isNaN(guestId) || guestId <= 0) {
            alert('Пожалуйста, введите корректный ID постояльца');
            return;
        }

        if (!roomId || isNaN(roomId) || roomId <= 0) {
            alert('Пожалуйста, введите корректный ID номера');
            return;
        }

        if (!checkInDate || !checkOutDate) {
            alert('Пожалуйста, введите даты заезда и выезда');
            return;
        }

        const bookingRequest = { guestId, roomId, checkInDate, checkOutDate };

        fetch('/api/univer/bookings/saveBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Гость с указанным ID не существует")) {
                    alert("Гость с указанным ID не существует");
                }
                if(message.includes("Комната с указанным ID не существует")) {
                    alert("Комната с указанным ID не существует");
                }
                if(message.includes("Отели не совпадают")) {
                    alert("Отели не совпадают");
                }
                if(message.includes("Дата заезда не может быть позже даты выезда")) {
                    alert("Дата заезда не может быть позже даты выезда");
                }
                if(message.includes("Эти даты заняты")) {
                    alert("Эти даты заняты");
                }
                loadData('/api/univer/bookings', 'booking-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при добавлении бронирования:', error));
    }

    // Функция для обновления бронирования
    function updateBooking() {
        const bookingId = document.getElementById('updateBookingId').value.trim();
        const guestId = document.getElementById('updateBookingGuestId').value.trim();
        const roomId = document.getElementById('updateBookingRoomId').value.trim();
        const checkInDate = document.getElementById('updateCheckInDate').value.trim();
        const checkOutDate = document.getElementById('updateCheckOutDate').value.trim();

        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования');
            return;
        }

        const bookingRequest = { bookingId, guestId, roomId, checkInDate, checkOutDate };

        fetch('/api/univer/bookings/updateBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Гость с указанным ID не существует")) {
                    alert("Гость с указанным ID не существует");
                }
                if(message.includes("Комната с указанным ID не существует")) {
                    alert("Комната с указанным ID не существует");
                }
                if(message.includes("Отели не совпадают")) {
                    alert("Отели не совпадают");
                }
                if(message.includes("Дата заезда не может быть позже даты выезда")) {
                    alert("Дата заезда не может быть позже даты выезда");
                }
                if(message.includes("Эти даты заняты")) {
                    alert("Эти даты заняты");
                }
                loadData('/api/univer/bookings', 'booking-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при обновлении бронирования:', error));
    }

    // Функция для удаления бронирования
    function deleteBooking() {
        const bookingId = document.getElementById('deleteBookingId').value.trim();
        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования для удаления');
            return;
        }

        fetch(`/api/univer/bookings/deleteBooking/${bookingId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении бронирования");
                    throw new Error();
                }
                alert("Бронирование успешно удалено");
                loadData('/api/univer/bookings', 'booking-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при удалении бронирования:', error));
    }

    function deleteBookingCascade() {
        const bookingId = document.getElementById('deleteBookingId').value.trim();
        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования для удаления');
            return;
        }

        fetch(`/api/univer/bookings/deleteBookingCascade/${bookingId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении бронирования");
                    throw new Error();
                }
                alert("Бронирование успешно удалено");
                loadData('/api/univer/bookings', 'booking-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при удалении бронирования:', error));
    }

    // Функция для отображения списка бронирований
    function displayBookings(bookings) {
        const bookingList = document.getElementById('content');
        bookingList.innerHTML = '';
        bookings.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<p>${item.bookingId} Бронирование: ${item.room.roomId || ''} номер типа ${item.room.roomType || ''} в отеле ${item.room.hotel.name} (${item.room.hotel.hotelId}) арендован постояльцем ${item.guest.firstName || ''} ${item.guest.lastName || ''} (${item.guest.guestId}). Заезд: ${item.checkInDate || ''}, выезд: ${item.checkOutDate || ''}</p>`;
            bookingList.appendChild(div);
        });
    }

    // Подключение функций к глобальной области
    window.findBookingById = findBookingById;
    window.findBookingsByGuestId = findBookingsByGuestId;
    window.findBookingsByRoomId = findBookingsByRoomId;
    window.findBookingsByDateRange = findBookingsByDateRange;
    window.saveBooking = saveBooking;
    window.updateBooking = updateBooking;
    window.deleteBooking = deleteBooking;
    window.deleteBookingCascade = deleteBookingCascade;
});

document.addEventListener('DOMContentLoaded', () => {
    // Функция для поиска услуги по ID
    function findProvisionById() {
        const provisionId = document.getElementById('provisionProvisionId').value.trim();
        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID услуги');
            return;
        }

        fetch(`/api/univer/provisions/id/${provisionId}`)
            .then(response => response.json())
            .then(provision => {
                if (provision) {
                    displayProvisions([provision]);
                } else {
                    alert('Услуга не найдена');
                }
            })
            .catch(error => console.error('Ошибка при загрузке услуги по ID:', error));
    }

    // Функция для поиска услуги по ID отеля
    function findProvisionByHotelId() {
        const hotelId = document.getElementById('provisionHotelId').value.trim();
        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля');
            return;
        }

        fetch(`/api/univer/provisions/hotelId/${hotelId}`)
            .then(response => response.json())
            .then(provision => {
                if (provision) {
                    displayProvisions([provision]);
                } else {
                    alert('Услуга для этого отеля не найдена');
                }
            })
            .catch(error => console.error('Ошибка при загрузке услуги по ID отеля:', error));
    }

    // Функция для добавления новой услуги
    function saveProvision() {
        const hotelId = document.getElementById('newHotelId').value.trim();
        const provisionName = document.getElementById('newProvisionName').value.trim();
        const provisionDescription = document.getElementById('newProvisionDescription').value.trim();

        if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
            alert('Пожалуйста, введите корректный ID отеля');
            return;
        }

        if (!provisionName) {
            alert('Пожалуйста, введите название услуги');
            return;
        }

        if (!provisionDescription) {
            alert('Пожалуйста, введите описание услуги');
            return;
        }

        const provisionRequest = { hotelId, provisionName, provisionDescription };

        fetch('/api/univer/provisions/saveProvision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(provisionRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Отель с указанным ID не существует")) {
                    alert("Отель с указанным ID не существует");
                }
                loadData('/api/univer/provisions', 'provision-list', 'Список услуг');
            })
            .catch(error => console.error('Ошибка при добавлении услуги:', error));
    }

    // Функция для обновления услуги
    function updateProvision() {
        const provisionId = document.getElementById('updateProvisionId').value.trim();
        const provisionName = document.getElementById('updateProvisionName').value.trim();
        const provisionDescription = document.getElementById('updateProvisionDescription').value.trim();

        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID услуги для обновления');
            return;
        }

        if (!provisionName) {
            alert('Пожалуйста, введите новое название услуги');
            return;
        }

        if (!provisionDescription) {
            alert('Пожалуйста, введите новое описание услуги');
            return;
        }

        const provisionRequest = { provisionId, provisionName, provisionDescription };

        fetch('/api/univer/provisions/updateProvision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(provisionRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Бронирование с указанным ID не существует")) {
                    alert("Бронирование с указанным ID не существует");
                }
                loadData('/api/univer/provisions', 'provision-list', 'Список услуг');
            })
            .catch(error => console.error('Ошибка при обновлении услуги:', error));
    }

    // Функция для удаления услуги
    function deleteProvision() {
        const provisionId = document.getElementById('deleteProvisionId').value.trim();
        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID услуги для удаления');
            return;
        }

        fetch(`/api/univer/provisions/deleteProvision/${provisionId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении услуги");
                    throw new Error();
                }
                alert("Услуга успешно удалена");
                loadData('/api/univer/provisions', 'room-list', 'Список номеров');
            })
            .catch(error => console.error('Ошибка при удалении услуги:', error));
    }

    function deleteProvisionCascade() {
        const provisionId = document.getElementById('deleteProvisionId').value.trim();
        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID услуги для удаления');
            return;
        }

        fetch(`/api/univer/provisions/deleteProvisionCascade/${provisionId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении услуги");
                    throw new Error();
                }
                alert("Услуга успешно удалена");
                loadData('/api/univer/provisions', 'room-list', 'Список номеров');
            })
            .catch(error => console.error('Ошибка при удалении услуги:', error));
    }

    // Функция для отображения списка услуг
    function displayProvisions(provisions) {
        const provisionList = document.getElementById('content');
        provisionList.innerHTML = '';
        provisions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<p>${item.provisionId} Услуга: ${item.provisionName || ''} в отеле ${item.hotel.name} (${item.hotel.hotelId}), цена: ${item.price || ''} руб</p>`;
            provisionList.appendChild(div);
        });
    }

    // Подключение функций к глобальной области
    window.findProvisionById = findProvisionById;
    window.findProvisionByHotelId = findProvisionByHotelId;
    window.saveProvision = saveProvision;
    window.updateProvision = updateProvision;
    window.deleteProvision = deleteProvision;
    window.deleteProvisionCascade = deleteProvisionCascade;
});

document.addEventListener('DOMContentLoaded', () => {
    // Функция для поиска бронирования услуги по ID
    function findBookingProvisionById() {
        const provisionId = document.getElementById('bookingProvisionId').value.trim();
        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования услуги');
            return;
        }

        fetch(`/api/univer/bookingProvisions/id/${provisionId}`)
            .then(response => response.json())
            .then(bookingProvision => {
                if (bookingProvision) {
                    displayBookingProvisions([bookingProvision]);
                } else {
                    alert('Бронирование услуги не найдено');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирования услуги по ID:', error));
    }

    // Функция для поиска бронирования услуги по ID бронирования
    function findBookingProvisionsByBookingId() {
        const bookingId = document.getElementById('findBookingProvisionBookingId').value.trim();
        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования');
            return;
        }

        fetch(`/api/univer/bookingProvisions/bookingId/${bookingId}`)
            .then(response => response.json())
            .then(bookingProvisions => {
                if (bookingProvisions.length > 0) {
                    displayBookingProvisions(bookingProvisions);
                } else {
                    alert('Бронирования для этого ID не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирований по ID бронирования:', error));
    }

    // Функция для поиска бронирования услуги по ID услуги
    function findBookingProvisionsByProvisionId() {
        const provisionId = document.getElementById('provisionId').value.trim();
        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID услуги');
            return;
        }

        fetch(`/api/univer/bookingProvisions/provisionId/${provisionId}`)
            .then(response => response.json())
            .then(bookingProvisions => {
                if (bookingProvisions.length > 0) {
                    displayBookingProvisions(bookingProvisions);
                } else {
                    alert('Бронирования для этой услуги не найдены');
                }
            })
            .catch(error => console.error('Ошибка при загрузке бронирований по ID услуги:', error));
    }

    // Функция для сохранения нового бронирования услуги
    function saveBookingProvision() {
        const bookingId = document.getElementById('newBookingId').value.trim();
        const provisionId = document.getElementById('newProvisionId').value.trim();

        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования');
            return;
        }

        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный ID услуги');
            return;
        }

        const bookingProvisionRequest = { bookingId, provisionId};

        fetch('/api/univer/bookingProvisions/saveBookingProvision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingProvisionRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Бронирование с указанным ID не существует")) {
                    alert("Бронирование с указанным ID не существует");
                }
                if(message.includes("Услуга с указанным ID не существует")) {
                    alert("Услуга с указанным ID не существует");
                }
                if(message.includes("Такое бронирование уже существует")) {
                    alert("Такое бронирование уже существует");
                }
                if(message.includes("Отели не совпадают")) {
                    alert("Отели не совпадают");
                }
                loadData('/api/univer/bookingProvisions', 'booking-provision-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при добавлении бронирования услуги:', error));
    }

    // Функция для обновления бронирования услуги
    function updateBookingProvision() {
        const bookingProvisionId = Number(document.getElementById('updateBookingProvisionId').value.trim());
        const bookingId = Number(document.getElementById('updateBookingProvisionBookingId').value.trim());
        const provisionId = Number(document.getElementById('updateBookingProvisionProvisionId').value.trim());

        if (!bookingProvisionId || isNaN(bookingProvisionId) || bookingProvisionId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования для обновления');
            return;
        }

        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            alert('Пожалуйста, введите корректный новый ID бронирования');
            return;
        }

        if (!provisionId || isNaN(provisionId) || provisionId <= 0) {
            alert('Пожалуйста, введите корректный новый ID услуги');
            return;
        }


        const bookingProvisionRequest = { bookingProvisionId, bookingId, provisionId };

        fetch('/api/univer/bookingProvisions/updateBookingProvision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingProvisionRequest)
        })
            .then(response => response.text())
            .then(message => {
                if(message.includes("Бронирование с указанным ID не существует")) {
                    alert("Бронирование с указанным ID не существует");
                }
                if(message.includes("Услуга с указанным ID не существует")) {
                    alert("Услуга с указанным ID не существует");
                }
                if(message.includes("Такое бронирование уже существует")) {
                    alert("Такое бронирование уже существует");
                }
                if(message.includes("Отели не совпадают")) {
                    alert("Отели не совпадают");
                }
                loadData('/api/univer/bookingProvisions', 'booking-provision-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при обновлении бронирования услуги:', error));
    }

    // Функция для удаления бронирования услуги
    function deleteBookingProvision() {
        const bookingProvisionId = document.getElementById('deleteBookingProvisionId').value.trim();
        if (!bookingProvisionId || isNaN(bookingProvisionId) || bookingProvisionId <= 0) {
            alert('Пожалуйста, введите корректный ID бронирования для удаления');
            return;
        }

        fetch(`/api/univer/bookingProvisions/deleteBookingProvision/${bookingProvisionId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    alert("Ошибка при удалении бронирования услуги");
                    throw new Error();
                }
                alert("Бронирование услуги успешно удалено");
                loadData('/api/univer/bookingProvisions', 'booking-list', 'Список бронирований');
            })
            .catch(error => console.error('Ошибка при удалении бронирования услуги:', error));
    }

    // Функция для отображения списка бронирований услуг
    function displayBookingProvisions(bookingProvisions) {
        const provisionList = document.getElementById('content');
        provisionList.innerHTML = '';
        bookingProvisions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<p>${item.bookingProvisionId} Бронирование услуги: ${item.provision?.provisionName || ''} для номера ${item.booking?.room?.roomId || ''}</p>`;
            provisionList.appendChild(div);
        });
    }

    // Подключение функций к глобальной области
    window.findBookingProvisionById = findBookingProvisionById;
    window.findBookingProvisionsByBookingId = findBookingProvisionsByBookingId;
    window.findBookingProvisionsByProvisionId = findBookingProvisionsByProvisionId;
    window.saveBookingProvision = saveBookingProvision;
    window.updateBookingProvision = updateBookingProvision;
    window.deleteBookingProvision = deleteBookingProvision;
});

