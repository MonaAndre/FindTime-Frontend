export interface AddCategoryToEventDtoRequest {
  groupId: number;
  eventId: number;
  categoryId: number;
}

export interface CategoryListDtoResponse {
  categoryId: number;
  categoryName?: string;
  categoryColor?: string;
}

export interface CreateCategoryDtoRequest {
  groupId: number;
  categoryName?: string;
  categoryColor?: string;
}

export interface DeleteCategoryDtoRequest {
  groupId: number;
  categoryId: number;
}

export interface UpdateCategoryRequestDto {
  categoryId: number;
  groupId: number;
  categoryName?: string;
  categoryColor?: string;
}