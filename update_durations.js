const pool = require('./backend/src/config/database');

const updateDurations = async () => {
  const services = [
    { name: 'Home Cleaning', duration: 120 },
    { name: 'Electrical Repair', duration: 60 },
    { name: 'Plumbing Service', duration: 90 },
    { name: 'Car Detailing', duration: 150 },
    { name: 'Painting Service', duration: 240 },
    { name: 'Lawn Care', duration: 60 },
    { name: 'HVAC Maintenance', duration: 120 },
    { name: 'Pet Grooming', duration: 90 },
  ];

  try {
    for (const s of services) {
      await pool.query(
        'UPDATE services SET duration_minutes = $1 WHERE name = $2 AND duration_minutes IS NULL',
        [s.duration, s.name]
      );
    }
    console.log('Updated existing services durations');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateDurations();
