import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Otopark } from "./otopark.entity";

@Entity("available_space") //her bir park yeri
export class AvailableSpace {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Otopark, (otopark) => otopark.avaliableSpaces, {
  onDelete: 'CASCADE'
})
    @JoinColumn({ name: 'otopark_id' }) 
    otopark: Otopark;
    @Column({ type: 'boolean', default: true })
    isAvailable: boolean;
    @Column({ nullable: false })
    index: number; //her bir park yerinin indexi
    
    @Column({ type: 'varchar',nullable:true })
    parkedusername: string;

    @Column({ type: 'varchar',nullable:true })
    carPlate: string; //carplate

    @UpdateDateColumn({ nullable: true })
    parkedAt: Date; //ne zaman park etti
}