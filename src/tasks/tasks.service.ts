import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "prisma/prisma.service"
import { CreateTaskDto } from "./dtos/create-task.dto"
import { Task } from "@prisma/client"
import { UpdateTaskDto } from "./dtos/update-task.dto"

@Injectable()
export class TasksService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll() {
		return await this.prismaService.task.findMany()
	}

	async createOne(dto: CreateTaskDto): Promise<Task> {
		const task = await this.prismaService.task.create({
			data: dto
		})

		return task
	}

	async updateOne(id: number, dto: UpdateTaskDto) {
		await this.getOneOrThrow(id)

		const updateTask = await this.prismaService.task.update({
			where: { id },
			data: dto
		})
		return updateTask
	}

	async deleteOne(id: number) {
		await this.getOneOrThrow(id)

		const deletedTask = await this.prismaService.task.delete({
			where: { id }
		})
		return deletedTask
	}

	private async getOneOrThrow(id: number) {
		const task = await this.prismaService.task.findUnique({ where: { id } })

		if (!task) {
			throw new NotFoundException("Тудушка не найдена")
		}

		return task
	}
}
