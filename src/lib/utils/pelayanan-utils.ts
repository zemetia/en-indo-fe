import { Pelayanan } from '@/lib/helper';

/**
 * Consolidated pelayanan type - groups ministries across multiple churches
 */
export interface ConsolidatedPelayanan {
  ministry: string;              // e.g., "Keyboard"
  churches: string[];            // e.g., ["Every Nation Surabaya", "Every Nation Jakarta"]
  churchIds: string[];           // Church IDs
  pelayananIds: string[];        // Pelayanan IDs for this ministry across all churches
  isPIC: boolean;                // True if user is PIC in at least one church for this ministry
  picChurches: string[];         // List of churches where user is PIC for this ministry
}

/**
 * Consolidates pelayanan by ministry name, grouping multiple churches together
 *
 * @param pelayananList - Array of pelayanan assignments
 * @returns Array of consolidated pelayanan grouped by ministry name
 *
 * @example
 * Input:
 * [
 *   { pelayanan: "Keyboard", church_name: "EN Surabaya", is_pic: false, ... },
 *   { pelayanan: "Keyboard", church_name: "EN Jakarta", is_pic: true, ... },
 *   { pelayanan: "PIC Lifegroup", church_name: "EN Bali", is_pic: true, ... }
 * ]
 *
 * Output:
 * [
 *   {
 *     ministry: "Keyboard",
 *     churches: ["EN Surabaya", "EN Jakarta"],
 *     isPIC: true,
 *     picChurches: ["EN Jakarta"]
 *   },
 *   {
 *     ministry: "PIC Lifegroup",
 *     churches: ["EN Bali"],
 *     isPIC: true,
 *     picChurches: ["EN Bali"]
 *   }
 * ]
 */
export function consolidatePelayanan(pelayananList: Pelayanan[]): ConsolidatedPelayanan[] {
  if (!pelayananList || pelayananList.length === 0) {
    return [];
  }

  // Group by ministry name
  const ministryMap = new Map<string, ConsolidatedPelayanan>();

  pelayananList.forEach((pelayanan) => {
    const ministryName = pelayanan.pelayanan;

    if (!ministryMap.has(ministryName)) {
      ministryMap.set(ministryName, {
        ministry: ministryName,
        churches: [],
        churchIds: [],
        pelayananIds: [],
        isPIC: false,
        picChurches: [],
      });
    }

    const consolidated = ministryMap.get(ministryName)!;

    // Add church info (avoid duplicates)
    if (!consolidated.churchIds.includes(pelayanan.church_id)) {
      consolidated.churches.push(pelayanan.church_name);
      consolidated.churchIds.push(pelayanan.church_id);
    }

    // Track pelayanan IDs
    consolidated.pelayananIds.push(pelayanan.pelayanan_id);

    // Track PIC status
    if (pelayanan.is_pic) {
      consolidated.isPIC = true;
      if (!consolidated.picChurches.includes(pelayanan.church_name)) {
        consolidated.picChurches.push(pelayanan.church_name);
      }
    }
  });

  return Array.from(ministryMap.values());
}

/**
 * Formats church list as a semicolon-separated string
 *
 * @param churches - Array of church names
 * @returns Formatted string: "Church 1; Church 2; Church 3"
 */
export function formatChurchList(churches: string[]): string {
  return churches.join('; ');
}

/**
 * Gets a display string for a consolidated ministry with churches
 *
 * @param ministry - Ministry name
 * @param churches - Array of church names
 * @returns Formatted string: "Ministry - Church 1; Church 2"
 */
export function getMinistryDisplayText(ministry: string, churches: string[]): string {
  if (churches.length === 0) return ministry;
  if (churches.length === 1) return `${ministry} - ${churches[0]}`;
  return `${ministry} - ${formatChurchList(churches)}`;
}

/**
 * Gets PIC display text for consolidated pelayanan
 *
 * @param consolidated - Consolidated pelayanan data
 * @returns String describing PIC status, or empty string if not PIC
 */
export function getPICDisplayText(consolidated: ConsolidatedPelayanan): string {
  if (!consolidated.isPIC) return '';

  if (consolidated.picChurches.length === consolidated.churches.length) {
    return 'PIC di semua gereja';
  }

  if (consolidated.picChurches.length === 1) {
    return `PIC di ${consolidated.picChurches[0]}`;
  }

  return `PIC di ${consolidated.picChurches.length} gereja`;
}
