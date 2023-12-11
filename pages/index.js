import Head from "next/head";
import styles from "../styles/Home.module.css";

import React, { useState, useEffect } from "react";

const MedicationSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [checkedMeds, setCheckedMeds] = useState({});

  useEffect(() => {
    const csvData = `Medication,07:00,07:15,07:30,09:15,09:30,11:15,12:15,13:15,15:15,17:15,17:30,19:15,21:15,21:30,23:15,23:30
    Dexafree,X,,,,,,X,,,,X,,,,,X
    Hylo Forte,,X,,X,,X,,X,X,X,,X,X,,X,
    Chloromycetin,,,,,X,,,,,,,,,X,,
    Timofluid,,,X,,,,,,,,,,,,,`;

    // Parsing and organizing the data
    const lines = csvData.split("\n");
    const headers = lines[0].split(",").slice(1);
    const tempSchedule = {};

    lines.slice(1).forEach((line) => {
      const parts = line.split(",");
      const medication = parts[0];
      parts.slice(1).forEach((part, index) => {
        if (part === "X") {
          const time = headers[index];
          if (!tempSchedule[time]) {
            tempSchedule[time] = [];
          }
          tempSchedule[time].push(medication);
        }
      });
    });

    setSchedule(tempSchedule);
    loadCheckedMedications();
  }, []);

  const toggleGreen = (time) => {
    setCheckedMeds((prev) => {
      const newMeds = { ...prev };
      newMeds[time] = !newMeds[time];
      saveCheckedMedications(time, newMeds[time]);
      return newMeds;
    });
  };

  const saveCheckedMedications = (time, isChecked) => {
    const today = new Date().toDateString();
    const meds = JSON.parse(localStorage.getItem(today) || "{}");
    meds[time] = isChecked;
    localStorage.setItem(today, JSON.stringify(meds));
  };

  const loadCheckedMedications = () => {
    const today = new Date().toDateString();
    const meds = JSON.parse(localStorage.getItem(today) || "{}");
    setCheckedMeds(meds);
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {Object.keys(schedule)
          .sort()
          .map((time) => (
            <button
              key={time}
              className={`${styles.button} ${
                checkedMeds[time] ? styles.green : ""
              }`}
              onClick={() => toggleGreen(time)}
            >
              {`${time}: ${schedule[time].join(", ")}`}
            </button>
          ))}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <Head>
        <title>Medications</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MedicationSchedule />

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
