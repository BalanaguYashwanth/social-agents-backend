import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    UpdateDateColumn,
} from "typeorm";

@Entity("wallet_transaction")
export class WalletTransaction extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    pk: bigint;

    @Column({ type: "text", nullable: false, unique: true })
    wallet_address: string;

    @Column({ type: "bigint", nullable: false })
    amount: bigint;    

    @Column({ type: "simple-array", nullable: false, default: "" })
    transaction: string[] = [];
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
