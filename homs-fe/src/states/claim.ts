import { defineStore } from 'pinia'

export interface ClaimSummary {
    cancel: number;
    complete: number;
    exchange: number;
  }

export const useClaimStore = defineStore('claim', {
  state: () => ({
    claimSummary: {
      cancel: 0,
      complete: 0,
      exchange: 0,
    } as ClaimSummary
  }),
  actions: {
    updateSummary(summary: ClaimSummary) {
        this.claimSummary.cancel = summary.cancel;
        this.claimSummary.complete = summary.complete;
        this.claimSummary.exchange = summary.exchange;
    }
  }
})
