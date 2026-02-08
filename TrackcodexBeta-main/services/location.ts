/**
 * Location Service
 * Handles GPS location tracking with permission handling and reverse geocoding
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  timestamp: number;
}

export interface LocationError {
  code:
    | "PERMISSION_DENIED"
    | "POSITION_UNAVAILABLE"
    | "TIMEOUT"
    | "GEOCODING_FAILED";
  message: string;
}

class LocationService {
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;

  /**
   * Request GPS permission and get current location
   */
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: "POSITION_UNAVAILABLE",
          message: "Geolocation is not supported by your browser",
        } as LocationError);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locationData = await this.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            );
            this.currentLocation = locationData;
            resolve(locationData);
          } catch (error) {
            reject({
              code: "GEOCODING_FAILED",
              message: "Failed to convert coordinates to address",
            } as LocationError);
          }
        },
        (error) => {
          let errorCode: LocationError["code"] = "POSITION_UNAVAILABLE";
          let errorMessage = "Unable to retrieve your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorCode = "PERMISSION_DENIED";
              errorMessage =
                "Location permission denied. Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorCode = "POSITION_UNAVAILABLE";
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorCode = "TIMEOUT";
              errorMessage = "Location request timed out.";
              break;
          }

          reject({ code: errorCode, message: errorMessage } as LocationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  }

  /**
   * Convert coordinates to human-readable address using OpenStreetMap Nominatim API
   */
  private async reverseGeocode(
    lat: number,
    lon: number,
  ): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "TrackCodex/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Geocoding API request failed");
      }

      const data = await response.json();
      const address = data.address;

      // Build location string
      const parts = [];
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village);
      }
      if (address.state) {
        parts.push(address.state);
      }
      if (address.country) {
        parts.push(address.country);
      }

      return {
        latitude: lat,
        longitude: lon,
        address: parts.join(", ") || data.display_name,
        city: address.city || address.town || address.village,
        state: address.state,
        country: address.country,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      // Fallback to coordinates
      return {
        latitude: lat,
        longitude: lon,
        address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Start watching location changes (for live tracking)
   */
  startWatching(
    callback: (location: LocationData) => void,
    onError?: (error: LocationError) => void,
  ): void {
    if (!navigator.geolocation) {
      onError?.({
        code: "POSITION_UNAVAILABLE",
        message: "Geolocation is not supported",
      });
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const locationData = await this.reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          this.currentLocation = locationData;
          callback(locationData);
        } catch (error) {
          onError?.({
            code: "GEOCODING_FAILED",
            message: "Failed to convert coordinates to address",
          });
        }
      },
      (error) => {
        let errorCode: LocationError["code"] = "POSITION_UNAVAILABLE";
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorCode = "PERMISSION_DENIED";
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorCode = "POSITION_UNAVAILABLE";
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorCode = "TIMEOUT";
            errorMessage = "Location request timed out";
            break;
        }

        onError?.({ code: errorCode, message: errorMessage });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      },
    );
  }

  /**
   * Stop watching location changes
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get cached location (if available)
   */
  getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }
}

export const locationService = new LocationService();
