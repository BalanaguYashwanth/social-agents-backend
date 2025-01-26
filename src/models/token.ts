import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { FarcasterAccount } from "./farcaster_account";

@Entity("token")
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    pk: bigint;

    @ManyToOne(() => FarcasterAccount, (farcasterAccount) => farcasterAccount.pk, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "farcaster_account_fk" })
    farcaster_account_fk: FarcasterAccount;

    @Column({ type: "varchar", nullable: false, unique: true })
    listing: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    mint: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    mint_vault: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    sol_vault: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    seed: string;

    @Column({ type: "varchar", nullable: true })
    user_ata: string;

    @Column({ type: "varchar", nullable: false })
    wallet_address: string;

    @Column({ type: "varchar", nullable: false })
    transaction_hash: string;

    @Column({ type: "varchar", nullable: true })
    token_name: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
