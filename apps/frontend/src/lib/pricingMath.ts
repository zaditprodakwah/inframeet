import { services } from '@inframeet/config';

export interface PricingInput {
  segment: 'b2b' | 'academic';
  activeComponentIds: string[];
  volumes: Record<string, number>;
}

export interface PricingResult {
  basePrice: number;
  componentsPrice: number;
  volumesPrice: number;
  totalPrice: number;
  breakdown: Array<{
    id: string;
    name: string;
    price: number;
    isVolume: boolean;
    volumeCount?: number;
  }>;
}

export function calculatePricing({
  segment,
  activeComponentIds,
  volumes
}: PricingInput): PricingResult {
  const breakdown: PricingResult['breakdown'] = [];
  
  if (segment === 'b2b') {
    const basePrice = services.b2b_core_base.base_price_idr;
    let componentsPrice = 0;
    let volumesPrice = 0;

    // Add base price to breakdown
    breakdown.push({
      id: 'b2b_core_base',
      name: services.b2b_core_base.name,
      price: basePrice,
      isVolume: false
    });

    // B2B Modular components
    services.b2b_modular_components.forEach((comp: any) => {
      if (activeComponentIds.includes(comp.id)) {
        if (comp.is_volume_based) {
          const count = volumes[comp.id] || comp.min_units || 0;
          const cost = comp.price_per_unit_idr * count;
          volumesPrice += cost;
          breakdown.push({
            id: comp.id,
            name: comp.name,
            price: cost,
            isVolume: true,
            volumeCount: count
          });
        } else {
          componentsPrice += comp.price_flat_idr;
          breakdown.push({
            id: comp.id,
            name: comp.name,
            price: comp.price_flat_idr,
            isVolume: false
          });
        }
      }
    });

    return {
      basePrice,
      componentsPrice,
      volumesPrice,
      totalPrice: basePrice + componentsPrice + volumesPrice,
      breakdown
    };
  } else {
    // Academic components
    let componentsPrice = 0;
    let volumesPrice = 0;

    services.academic_modular_components.forEach((comp: any) => {
      if (activeComponentIds.includes(comp.id)) {
        if (comp.is_volume_based) {
          const count = volumes[comp.id] || comp.min_units || 0;
          const cost = comp.price_per_unit_idr * count;
          volumesPrice += cost;
          breakdown.push({
            id: comp.id,
            name: comp.name,
            price: cost,
            isVolume: true,
            volumeCount: count
          });
        } else {
          componentsPrice += comp.price_flat_idr;
          breakdown.push({
            id: comp.id,
            name: comp.name,
            price: comp.price_flat_idr,
            isVolume: false
          });
        }
      }
    });

    return {
      basePrice: 0,
      componentsPrice,
      volumesPrice,
      totalPrice: componentsPrice + volumesPrice,
      breakdown
    };
  }
}

/**
 * Reverse engineers features selection based on a target budget range.
 * Activates features sequentially in order of value until the budget cap is reached.
 */
export function reverseEngineerFeatures(
  segment: 'b2b' | 'academic',
  targetBudget: number
): { activeIds: string[]; volumes: Record<string, number> } {
  const activeIds: string[] = [];
  const volumes: Record<string, number> = {};

  if (segment === 'b2b') {
    const basePrice = services.b2b_core_base.base_price_idr;
    let currentBudget = basePrice;
    
    // Default initial volumes
    services.b2b_modular_components.forEach((comp: any) => {
      if (comp.is_volume_based) {
        volumes[comp.id] = comp.min_units;
      }
    });

    if (targetBudget < basePrice) {
      return { activeIds, volumes };
    }

    // Sequentially add B2B components as budget grows
    for (const comp of (services.b2b_modular_components as any[])) {
      if (comp.is_volume_based) {
        // Calculate min cost
        const minCost = comp.price_per_unit_idr * comp.min_units;
        if (currentBudget + minCost <= targetBudget) {
          activeIds.push(comp.id);
          currentBudget += minCost;
          // Scale up volume count based on remaining budget
          const remaining = targetBudget - currentBudget;
          const extraUnits = Math.min(
            comp.max_units - comp.min_units,
            Math.floor(remaining / comp.price_per_unit_idr)
          );
          if (extraUnits > 0) {
            volumes[comp.id] = comp.min_units + extraUnits;
            currentBudget += extraUnits * comp.price_per_unit_idr;
          }
        }
      } else {
        if (currentBudget + comp.price_flat_idr <= targetBudget) {
          activeIds.push(comp.id);
          currentBudget += comp.price_flat_idr;
        }
      }
    }
  } else {
    let currentBudget = 0;
    
    // Default initial volumes
    services.academic_modular_components.forEach((comp: any) => {
      if (comp.is_volume_based) {
        volumes[comp.id] = comp.min_units;
      }
    });

    // Sequentially add Academic components
    for (const comp of (services.academic_modular_components as any[])) {
      if (comp.is_volume_based) {
        const minCost = comp.price_per_unit_idr * comp.min_units;
        if (currentBudget + minCost <= targetBudget) {
          activeIds.push(comp.id);
          currentBudget += minCost;
          const remaining = targetBudget - currentBudget;
          const extraUnits = Math.min(
            comp.max_units - comp.min_units,
            Math.floor(remaining / comp.price_per_unit_idr)
          );
          if (extraUnits > 0) {
            volumes[comp.id] = comp.min_units + extraUnits;
            currentBudget += extraUnits * comp.price_per_unit_idr;
          }
        }
      } else {
        if (currentBudget + comp.price_flat_idr <= targetBudget) {
          activeIds.push(comp.id);
          currentBudget += comp.price_flat_idr;
        }
      }
    }
  }

  return { activeIds, volumes };
}
