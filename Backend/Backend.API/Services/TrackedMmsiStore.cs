using System.Collections.Concurrent;

namespace Backend.API.Services
{
    public class TrackedMmsiStore
    {
        private readonly ConcurrentDictionary<long, byte> _mmsis = new();

        public event Action? Changed;

        public IReadOnlyCollection<long> All() => _mmsis.Keys.ToArray();

        public bool Contains(long mmsi) => _mmsis.ContainsKey(mmsi);

        public bool Add(long mmsi)
        {
            var added = _mmsis.TryAdd(mmsi, 0);
            if (added) Changed?.Invoke();
            return added;
        }

        public bool Remove(long mmsi)
        {
            var removed = _mmsis.TryRemove(mmsi, out _);
            if (removed) Changed?.Invoke();
            return removed;
        }
    }
}
