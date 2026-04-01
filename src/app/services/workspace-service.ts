import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  public openWindows = signal<string[]>([]);

  open(agentId: string) {
    if (!this.openWindows().includes(agentId)) {
      this.openWindows.update((ids) => [...ids, agentId]);
    }
  }

  close(agentId: string) {
    this.openWindows.update((ids) => ids.filter((id) => id !== agentId));
  }
}
