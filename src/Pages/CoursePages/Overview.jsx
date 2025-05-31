const Overview = ({ description }) => {

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Overview</h2>
      <p className="text-lg text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default Overview;