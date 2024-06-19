import React from "react";
import LactateForm from "../components/Lactate/LactateForm";
import LactateChart from "../components/Lactate/LactateChart";
import TestingTable from "../components/Lactate/TestingTable";
import data from "../data/lactate.json";

const LactatePage = ({ selectedAthleteId }) => {
  return (
    <>
      <LactateForm selectedAthleteId={selectedAthleteId} />
      <LactateChart selectedAthleteId={selectedAthleteId} datas={data} />
      <TestingTable datas={data} selectedAthleteId={selectedAthleteId} />
    </>
  );
};

export default LactatePage;
