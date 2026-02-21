import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from '../../../core/models/job.model';
import { environment } from '../../../../environments/environment';

export interface JobSearchResult {
    jobs: Job[];
    totalResults: number;
}

@Injectable({ providedIn: 'root' })
export class JobService {
    private baseUrl = environment.adzunaBaseUrl;
    private appId = environment.adzunaAppId;
    private appKey = environment.adzunaAppKey;

    constructor(private http: HttpClient) { }

    searchJobs(keywords: string, location: string, page: number = 1, resultsPerPage: number = 10): Observable<JobSearchResult> {
        const country = 'us'; // UK for English results
        const url = `${this.baseUrl}/jobs/${country}/search/${page}`;

        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.appKey)
            .set('results_per_page', resultsPerPage.toString())
            .set('sort_by', 'date')
            .set('content-type', 'application/json');

        if (keywords) {
            params = params.set('what_and', keywords);
        }
        // Use title_only to search only in job titles as required by the brief
        if (keywords) {
            params = params.set('title_only', keywords);
        }
        if (location) {
            params = params.set('where', location);
        }

        return this.http.get<any>(url, { params }).pipe(
            map(response => ({
                jobs: this.mapAdzunaResults(response.results || []),
                totalResults: response.count || 0
            }))
        );
    }

    private mapAdzunaResults(results: any[]): Job[] {
        return results.map(item => ({
            id: item.id?.toString() || '',
            title: item.title || 'Poste non spécifié',
            company: item.company?.display_name || 'Entreprise non spécifiée',
            location: item.location?.display_name || 'Non spécifié',
            description: this.stripHtml(item.description || ''),
            url: item.redirect_url || '',
            salary: this.formatSalary(item.salary_min, item.salary_max),
            datePosted: item.created || new Date().toISOString(),
            apiSource: 'adzuna'
        }));
    }

    private stripHtml(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    private formatSalary(min?: number, max?: number): string {
        if (!min && !max) return 'Non spécifié';
        if (min && max) {
            return `£${Math.round(min).toLocaleString()} - £${Math.round(max).toLocaleString()}`;
        }
        if (min) return `À partir de £${Math.round(min).toLocaleString()}`;
        return `Jusqu'à £${Math.round(max!).toLocaleString()}`;
    }
}
