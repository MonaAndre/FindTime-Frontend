import api from "@/plugins/axios";
import type { ServiceResponse } from "@/types/api";
import type { AddCategoryToEventDtoRequest, CategoryListDtoResponse, CreateCategoryDtoRequest, DeleteCategoryDtoRequest, UpdateCategoryRequestDto } from "@/types/category";

export const categoryApi = {
    async createCategory(createCategoryReq: CreateCategoryDtoRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>('/api/Category/create-category', createCategoryReq);
        return response.data;
    },
    async addCategoryToEvent(addCategoryToEventReq: AddCategoryToEventDtoRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>('/api/Category/add-category', addCategoryToEventReq);
        return response.data;
    },
    async getAllCategories(groupId: number): Promise<ServiceResponse<CategoryListDtoResponse[]>> {
        const response = await api.get<ServiceResponse<CategoryListDtoResponse[]>>(`/api/Category/get-categories/${groupId}`);
        return response.data;
    },
    async updateCategory(updateCategoryReq: UpdateCategoryRequestDto): Promise<ServiceResponse<boolean>> {
        const response = await api.post<ServiceResponse<boolean>>('/api/Category/update-category', updateCategoryReq);
        return response.data;
    },
    async deleteCategory(deleteCategoryReq: DeleteCategoryDtoRequest): Promise<ServiceResponse<boolean>> {
        const response = await api.delete<ServiceResponse<boolean>>('/api/Category/delete-category', {
            data: deleteCategoryReq
        });
        return response.data;
    }

}