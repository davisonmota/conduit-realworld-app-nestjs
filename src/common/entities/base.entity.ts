import { randomUUID } from 'node:crypto'
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class BaseEntity<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data)
    this.id = this.id || randomUUID()
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @BeforeInsert()
  beforeInsert() {
    this.created_at = this.created_at || new Date()
    this.updated_at = new Date()
  }

  @UpdateDateColumn()
  updated_at: Date

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date()
  }
}
