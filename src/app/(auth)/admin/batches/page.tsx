const page = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Batches</h1>
      <p className="text-sm text-muted-foreground">
        This is the batches page. You can manage and view batch information
        here.
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example Batch Card */}
        <div className="p-4 rounded shadow flex items-center gap-4 bg-muted">
          <div>
            <h2 className="text-lg font-medium">Batch 1</h2>
            <p className="text-sm text-muted-foreground">
              Start Date: 2024-01-01
            </p>
            <p className="text-sm text-muted-foreground">
              End Date: 2024-06-30
            </p>
          </div>
        </div>
        {/* Add more batch cards as needed */}
      </div>
    </div>
  );
};

export default page;
