export interface VectorClock {
    [replicaId: string]: number;
}

export module VectorClock {
    export function empty(): VectorClock {
        return {};
    }

    export function inc(clock: VectorClock, replicaId: string): VectorClock {
        return { ...clock, [replicaId]: (clock[replicaId] ?? 0) + 1 };
    }

    export function compare(v1: VectorClock, v2: VectorClock): 'lt' | 'eq' | 'gt' | 'concurrent' {
        const replicaIds = new Set([...Object.keys(v1), ...Object.keys(v2)]);

        let cntV1New = 0;
        let cntV2New = 0;

        for (const replicaId of replicaIds) {
            const t1 = v1[replicaId] ?? 0;
            const t2 = v2[replicaId] ?? 0;

            if (t1 > t2) cntV1New++;
            if (t2 > t1) cntV2New++;
        }

        if (cntV1New === 0 && cntV2New === 0) return 'eq';
        if (cntV2New === 0) return 'gt';
        if (cntV1New === 0) return 'lt';
        return 'concurrent';
    }

    export function hardCompare(v1: VectorClock, v2: VectorClock): 'lt' | 'eq' | 'gt' {
        const replicaIds = new Set([...Object.keys(v1), ...Object.keys(v2)]);

        const v1NewIds: string[] = [];
        const v2NewIds: string[] = [];

        for (const replicaId of replicaIds) {
            const t1 = v1[replicaId] ?? 0;
            const t2 = v2[replicaId] ?? 0;

            if (t1 > t2) v1NewIds.push(replicaId);
            if (t2 > t1) v2NewIds.push(replicaId);
        }

        if (v1NewIds.length === 0 && v2NewIds.length === 0) return 'eq';
        if (v2NewIds.length === 0) return 'gt';
        if (v1NewIds.length === 0) return 'lt';

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const firstV1NewId = v1NewIds.sort()[0]!;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const firstV2NewId = v2NewIds.sort()[0]!;

        return firstV1NewId.localeCompare(firstV2NewId) === -1 ? 'lt' : 'gt';
    }
}
