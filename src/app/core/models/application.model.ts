export type ApplicationStatus = 'en_attente' | 'accepte' | 'refuse';

export interface Application {
    id?: number;
    userId: number;
    offerId: string;
    apiSource: string;
    title: string;
    company: string;
    location: string;
    url: string;
    status: ApplicationStatus;
    notes: string;
    dateAdded: string;
}
