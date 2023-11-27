import React, { useEffect, useState } from "react";
import Chart from "./chart";
import useStatisticsQuery from "../api/statistics";
import useUsersQuery, { User } from "../api/users";

export type Statistics = { data: number[]; labels: string[] };

const AdminPage = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  const { handleGetStatistics } = useStatisticsQuery();
  const { handleGetUsers } = useUsersQuery();

  useEffect(() => {
    handleGetStatistics().then((statistics) => {
      const values = statistics.map((statistic) => statistic.size);
      const dates = statistics.map((statistic) => statistic.date);

      console.log(dates);

      setStatistics({ data: values, labels: dates });
    });

    handleGetUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  if (!statistics || !users) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button
        style={{ position: "absolute", marginTop: 10 }}
        className="button-23"
        onClick={() => (window.location.href = "map")}
      >
        Go to map
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "65vh",
            width: "90vw",
            textAlign: "center",
            paddingBottom: 20,
          }}
        >
          <Chart data={statistics.data} labels={statistics.labels} />
          <text>Users</text>
        </div>

        <div
          style={{
            display: "flex",
            maxHeight: "35vh",
            overflow: "auto",
            width: "100vw",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            paddingBottom: 20,
          }}
        >
          {users.map((user) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 200,
                  height: 100,
                  borderRadius: "15px",
                  padding: 20,
                  boxSizing: "border-box",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <text style={{ fontSize: 20 }}>{user.name}</text>
                  <img
                    style={{ borderRadius: "20px", height: 50, width: 50 }}
                    src={"https://picsum.photos/50/50"}
                  ></img>
                </div>
                <text>{user.isAdmin ? "Admin" : "User"}</text>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
