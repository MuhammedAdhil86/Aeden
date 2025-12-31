import MainStatCard from "./mainstatscard";

export default function StatsRow({
  stats,
  totalCount = 0,
  locationCount = 0,
}) {
  return (
    <div className="grid grid-cols-5 gap-5 mb-8">
      <MainStatCard
        icon="fluent:web-asset-16-regular"
        value={totalCount}
        label="Total Price Added"
      />

      <MainStatCard
        icon="bx:trip"
        value={locationCount}
        label="Locations"
      />

      <MainStatCard
        icon="mdi:arrow-down-bold-circle-outline"
        value={stats.lowest}
        label="Lowest Price"
      />

      <MainStatCard
        icon="mdi:arrow-up-bold-circle-outline"
        value={stats.highest}
        label="Highest Price"
      />

      <MainStatCard
        icon="mdi:scale-balance"
        value={stats.average}
        label="Average Price"
      />
    </div>
  );
}
