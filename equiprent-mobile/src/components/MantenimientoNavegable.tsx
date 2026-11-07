import React from 'react';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import type { Mantenimiento } from '../models/equiprent';
import { MantenimientoCard } from './MantenimientoCard';

type Props = { mantenimiento: Mantenimiento; codigoUnidad: string };

/**
 * Envuelve la tarjeta (presentación pura) con un Link.
 * Se envía SOLO el id por la ruta, nunca el objeto completo.
 */
export function MantenimientoNavegable({ mantenimiento, codigoUnidad }: Props) {
    return (
        <Link
            href={{ pathname: '/mantenimientos/[id]', params: { id: String(mantenimiento.id) } }}
            asChild
        >
            <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Ver detalle del mantenimiento ${mantenimiento.id}`}
            >
                <MantenimientoCard mantenimiento={mantenimiento} codigoUnidad={codigoUnidad} />
            </Pressable>
        </Link>
    );
}