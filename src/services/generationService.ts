import { apiClient, BACKEND_URL } from '../lib/api';

export interface GenerationResponse {
  images: string[];
  historyId: string;
}

export const generationService = {
  /**
   * Generate images using the backend API
   */
  async generateImages(
    imageUri: string,
    count: number,
    userId: string
  ): Promise<GenerationResponse> {
    try {
      // Convert image URI to base64 if needed
      let imageData = imageUri;
      
      if (imageUri.startsWith('file://')) {
        imageData = await this.convertFileToBase64(imageUri);
      }

      const response = await apiClient.post('/api/generation/generate', {
        imageUri: imageData,
        count,
        userId,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error generating images:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate images');
    }
  },

  /**
   * Convert file URI to base64
   */
  async convertFileToBase64(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw new Error('Failed to process image');
    }
  },

  /**
   * Get user generation history
   */
  async getHistory(userId: string) {
    try {
      const response = await apiClient.get(`/api/generation/history/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching history:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch history');
    }
  },

  /**
   * Delete a history item
   */
  async deleteHistory(historyId: string) {
    try {
      await apiClient.delete(`/api/generation/history/${historyId}`);
    } catch (error: any) {
      console.error('Error deleting history:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete history');
    }
  },

  /**
   * Download an image
   */
  async downloadImage(imageUri: string, filename: string) {
    try {
      const response = await apiClient.get(imageUri, {
        responseType: 'blob',
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download image');
    }
  },
};

