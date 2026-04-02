import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [poses, setPoses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8090/v1/poses");
        const data = await response.json();
        setPoses(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Get unique categories for the filter dropdown
  const categories = ["All", ...new Set(poses.map(p => p.pose_benefits.split(",")[0]))];

  // Filter poses based on search query and category
  const filteredPoses = poses.filter(pose => {
    const matchesSearch = pose.english_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" ||
      pose.pose_benefits.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Summary statistics
  const totalPoses = filteredPoses.length;
  const longestNameLength = filteredPoses.reduce(
    (max, p) => Math.max(max, p.english_name.length),
    0
  );
  const shortestNameLength = filteredPoses.reduce(
    (min, p) => Math.min(min, p.english_name.length),
    filteredPoses.length > 0 ? filteredPoses[0].english_name.length : 0
  );

  return (
    <div className="dashboard">
      <h1>Yoga Poses Dashboard</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by English Name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="summary">
        <p>Total Poses: {totalPoses}</p>
        <p>Longest Name Length: {longestNameLength}</p>
        <p>Shortest Name Length: {shortestNameLength}</p>
      </div>

      <div className="pose-list">
        {filteredPoses.map(pose => (
          <div key={pose.id} className="pose-row">
            <img src={pose.url_png} alt={pose.english_name} width={80} />
            <div className="pose-info">
              <h3>{pose.english_name}</h3>
              <p>{pose.sanskrit_name_adapted}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;