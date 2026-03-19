/**
 * useDisputes — frontend hook for contract disputes
 * Wraps backend contractService dispute methods via useAsyncData
 */
import { useAsyncData } from "@/frontend/hooks/useAsyncData";
import { getAllDisputes, getDispute, getContractDisputes } from "@/backend/services/contractService";
import type { ContractDispute } from "@/backend/models";

export function useDisputeList() {
  const { data, loading, error, refetch } = useAsyncData(() => getAllDisputes());
  return {
    disputes: data || [],
    loading,
    error,
    refetch,
  };
}

export function useDisputeDetail(id: string | undefined) {
  const { data, loading, error, refetch } = useAsyncData(
    () => (id ? getDispute(id) : Promise.resolve(null)),
    [id]
  );
  return {
    dispute: data,
    loading,
    error,
    refetch,
  };
}

export function useContractDisputes(contractId: string | undefined) {
  const { data, loading, error, refetch } = useAsyncData(
    () => (contractId ? getContractDisputes(contractId) : Promise.resolve([])),
    [contractId]
  );
  return {
    disputes: data || [],
    loading,
    error,
    refetch,
  };
}
