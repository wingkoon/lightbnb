INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO users (name, email, password)
VALUES 
('David Hall', 'davidhallvegeta@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Paige Nelmes', 'paigenelmesandroid18@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Mai Hall', 'futuremaihall@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES 
(1, 'Forest Cottage', 'Cozy forest cottage', 'https://images.pexels.com/photos/6530841/pexels-photo-6530841.jpeg??auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280', 'https://images.pexels.com/photos/6530841/pexels-photo-6530841.jpeg', 500, 2, 1, 2, 'Canada', '567 Forest Ave', 'Pine Grove', 'BC', 'M4I3A7', true),
(2, 'Giant Lake House', 'Huge lake mansion', 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280', 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg', 2000, 4, 3, 5, 'Canada', '345 Fancy St', 'Lake Town', 'BC', 'C4S7H5', true),
(1, 'City Apartment', 'Chic city apartment', 'https://images.pexels.com/photos/1829191/pexels-photo-1829191.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280', 'https://images.pexels.com/photos/1829191/pexels-photo-1829191.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 800, 1, 1, 1, 'Canada', '789 Main St', 'Vancouver', 'BC', 'F4N8C7', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
('2023-01-11', '2023-01-17', 1, 3),
('2023-01-18', '2023-01-22', 2, 1),
('2023-01-25', '2023-01-29', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
(3, 2, 1, 5, 'Thanks!'),
(2, 2, 2, 4, 'Great!'),
(3, 1, 3, 4, 'Nice!');